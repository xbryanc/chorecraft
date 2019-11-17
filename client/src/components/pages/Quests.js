import React, { Component } from 'react';
import axios from 'axios';
import classNames from 'classnames';
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
                <div className="pageTitle">
                    Quests
                </div>
                {this.props.userInfo.isParent ?
                    this.props.userInfo.children.length ?
                    (
                        <div>
                            <h2 className="questsSection">
                                Craft a quest!
                            </h2>
                            {[["Title", "text", "Dishes"], ["Description", "text", "Please do the dishes!"], ["EXP", "number", "10"], ["Coins", "number", "5"]].map(cur => {
                                let el = cur[0];
                                let type = cur[1];
                                let placeholder = cur[2];
                                return (
                                    <div className="form-group row questsCreateField">
                                        <label className="col-sm-2" htmlFor={`quests${el}`}>{el}:</label>
                                        <input className="form-control col-sm-10" id={`quests${el}`} name={el.toLowerCase()} type={type} onChange={this.changeState} placeholder={placeholder}></input>
                                    </div>
                                );
                            })}
                            <div className="form-group row">
                                <div className="col-sm-2 questsChildSelectionTitle">
                                    Explorers to embark:
                                </div>
                                <div className="col-sm-10 questsNameHolder">
                                {
                                    this.props.userInfo.children.map(el => (
                                        <div className="questsName">
                                            <label><input type="checkbox" value={el._id} onClick={this.updateQuestChildren} /> {el.username}</label>
                                        </div>
                                    ))
                                }
                                </div>
                            </div>
                            <button type="button" className={classNames("btn", "btn-secondary", {"disabled": !this.completedQuestFields()})} onClick={this.createQuest}>Create!</button>
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
                {this.state.quests && this.state.quests.length ?
                <div>
                    <h2 className="questsSection">
                        Open Quests
                    </h2>
                    <div className="card-deck">
                        {this.state.quests.map(q => (
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title questsQuestTitle">
                                        {q.title}
                                    </h5>
                                    <p className="card-text questsQuestDescription">
                                        {q.description}
                                        {this.props.userInfo.isParent ?
                                        <div className="questsNameHolder">
                                            {
                                                q.childrenId.map(el => (
                                                    <div className="questsName">
                                                        <label><input type="radio" onClick={() => this.completeQuest(q._id, el)} checked={false} /> {this.getChildName(el)}</label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        :
                                        null
                                        }
                                    </p>
                                </div>
                                <div class="card-footer">
                                    <small class="text-muted">
                                        {q.exp} EXP
                                        <br />
                                        {q.coins} coins
                                    </small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
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
                this.getQuests();
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
                this.getQuests();
            } else {
                alert("Sorry, we were unable to create the quest. Please try again later.");
            }
        })
    }
}