import React, { Component } from 'react';
import '../../css/app.css';
import '../../css/quests.css';

export default class Quests extends Component {
    constructor(props) {
        super(props);

        this.state = {};
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
                {this.state.isParent ?
                (
                    <div>
                        <div className="questsCreateTitle">
                            Make a new quest!
                        </div>
                        {[["Title", "text"], ["Description", "text"], ["Exp", "number"], ["Coins", "number"]].forEach(cur => {
                            let el = cur[0];
                            let type = cur[1];
                            return (
                                <div className="questsCreateField">
                                    <label htmlFor={`quests${el}`}>{el}</label>
                                    <input id={`quests${el}`} name={el.toLowerCase} type={type} onChange={this.changeState}></input>
                                </div>
                            );
                        })}
                        {
                            this.props.userInfo.children.forEach(el => (
                                <div>
                                    {el}
                                </div>
                            ))
                        }
                        <div className="questsCreateField">
                            <label htmlFor="questsTitle">Title</label>
                            <input id="questsTitle"></input>
                        </div>
                        <button onClick={this.makeQuest}>Create!</button>
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

    makeQuest = () => {
        console.log(this.state);
    }
}