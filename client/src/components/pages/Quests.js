import React, { Component } from 'react';
import axios from 'axios';
import '../../css/app.css';
import '../../css/quests.css';

export default class Quests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            questChildren: new Set([]),
        };
        this.props.updateUserInfo();
    }

    componentDidMount() {
        document.title = "Quests";
        this.getQuests();
    }

    render() {
        return (
            <div className="backgroundContainer">
                {this.props.userInfo.isParent ?
                    this.props.userInfo.children.length ?
                    (
                        <div>
                            <div className="questsCreateTitle">
                                Craft a quest!
                            </div>
                            {[["Title", "text"], ["Description", "text"], ["Exp", "number"], ["Coins", "number"]].map(cur => {
                                let el = cur[0];
                                let type = cur[1];
                                return (
                                    <div className="questsCreateField">
                                        <label htmlFor={`quests${el}`}>{el}:</label>
                                        <input id={`quests${el}`} name={el.toLowerCase()} type={type} onChange={this.changeState}></input>
                                    </div>
                                );
                            })}
                            <div className="questsChildSelectionTitle">
                                Select your explorers!
                            </div>
                            {
                                this.props.userInfo.children.map(el => (
                                    <div className="questsChildSelection">
                                        <input type="checkbox" value={el._id} onClick={this.updateQuestChildren} />
                                        <p>{el.username}</p>
                                    </div>
                                ))
                            }
                            <button onClick={this.createQuest}>Create!</button>
                        </div>
                    )
                    :
                    (
                        <div className="questsNeedChildren">
                            You have no registered explorers. Please register them to create quests for them!
                        </div>
                    )
                :
                null
                }
                <div className="questsHeader">
                    Quests
                </div>
                {this.state.quests && this.state.quests.length ?
                this.state.quests.map(q => (
                    <div className="questsQuest">
                        <div className="questsTitle">
                            {q.title}
                        </div>
                        <div className="questsDescription">
                            {q.description}
                        </div>
                        <div className="questsExp">
                            {q.exp} EXP
                        </div>
                        <div className="questsCoints">
                            {q.coins} coins
                        </div>
                        {this.props.userInfo.isParent ?
                        <div className="questsChildrenAssigned">
                            {
                                q.childrenId.map(el => (
                                    <div>
                                        <input type="radio" onClick={() => this.completeQuest(q._id, el)} />
                                        <p>{this.getChildName(el)}</p>
                                    </div>
                                ))
                            }
                        </div>
                        :
                        null
                        }
                    </div>
                ))
                :
                (
                    <div className="questsNoneFound">
                        {Object.keys(this.props.userInfo).length ?
                        <div>
                            No quests found.
                            {this.props.userInfo.isParent ?
                            " You "
                            :
                            ` ${this.props.userInfo.parentName} `
                            }
                            should make some more!
                        </div>
                        :
                        <div>
                            Please log in to view quests.
                        </div>
                        }
                    </div>
                )}
            </div>
        )
    }

    completeQuest = (qid, cid) => {
        let name = this.getChildName(cid);
        let proceed = confirm(`Are you sure you want to complete this quest for ${name}?`);
        if (!proceed) {
            return;
        }
        axios.post('/api/completeQuest', {
            quest: qid,
            child: cid,
        })
        .then(res => {
            if (res.data.done) {
                alert("Completed quest!");
            } else {
                alert("Could not complete quest at this time.");
            }
        });
    }

    getChildName = (id) => {
        let answer = "";
        this.props.userInfo.children.forEach(el => {
            if (el._id == id) {
                answer = el.username;
            }
        })
        return answer;
    }

    updateQuestChildren = (event) => {
        let curSet = this.state.questChildren;
        if (event.target.checked) {
            curSet.add(event.target.value);
        } else {
            curSet.delete(event.target.value);
        }
        this.setState({
            questChildren: curSet,
        });
    }

    changeState = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    getQuests = () => {
        fetch("/api/getQuests")
        .then(res => res.json())
        .then(res => {
            this.setState({quests: res});
        });
    }

    completedQuestFields = () => {
        return this.state.title && this.state.description && this.state.exp && this.state.coins && this.state.questChildren.size;
    }

    createQuest = () => {
        if (!this.completedQuestFields()) {
            return;
        }
        axios.post('/api/createQuest', {
            title: this.state.title,
            description: this.state.description,
            exp: this.state.exp,
            coins: this.state.coins,
            childrenId: this.state.questChildren,
        })
        .then(res => {
            if (res.data.done) {
                alert("Success!");
            } else {
                alert("Sorry, we were unable to create the quest. Please try again later.");
            }
        })
    }
}