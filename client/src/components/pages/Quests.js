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
    }

    componentDidMount() {
        document.title = "Quests";
        this.getQuests();
    }

    render() {
        return (
            <div>
                <div className="questsTitle">
                    Quests
                </div>
                {this.props.userInfo.isParent && this.props.userInfo.children.length ?
                (
                    <div>
                        <div className="questsCreateTitle">
                            Make a new quest!
                        </div>
                        {[["Title", "text"], ["Description", "text"], ["Exp", "number"], ["Coins", "number"]].map(cur => {
                            let el = cur[0];
                            let type = cur[1];
                            return (
                                <div className="questsCreateField">
                                    <label htmlFor={`quests${el}`}>{el}</label>
                                    <input id={`quests${el}`} name={el.toLowerCase()} type={type} onChange={this.changeState}></input>
                                </div>
                            );
                        })}
                        <div className="questsChildSelectionTitle">
                            Select your questers!
                        </div>
                        {
                            this.props.userInfo.childNames.forEach((el, ind) => (
                                <div className="questsChildSelection">
                                    <input type="checkbox" value={this.props.userInfo.children[ind]} onClick={this.updateQuestChildren} />
                                    <p> el</p>
                                </div>
                            ))
                        }
                        <button onClick={this.createQuest}>Create!</button>
                    </div>
                )
                :
                null
                }
                {this.state.quests && this.state.quests.length ?
                <p>
                    {this.state.quests}
                </p>
                :
                (
                    <p>
                        No quests found!
                    </p>
                )}
            </div>
        )
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