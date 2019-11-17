import React, { Component } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import '../../css/app.css';
import '../../css/profile.css';
import { maxHeaderSize } from 'http';

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.props.updateUserInfo();
    }

    componentDidMount() {
        let username = this.props.userInfo.username;
        document.title = username ? `${username}'s Profile` : "Login to see Profile";
    }

    render() {
        if (!Object.keys(this.props.userInfo).length) {
            return (
                <div className="profileLogin backgroundContainer">
                    Please log in to see profiles!
                </div>
            )
        }
        let rank = 0;
        let place = "";
        if (!this.props.userInfo.isParent) {
            rank = this.props.userInfo.siblings.filter(s => s.exp > this.props.userInfo.exp).length + 1;
            place = rank.toString() + ["th", "st", "nd", "rd", "th"][Math.min(rank % 10, 4)];
        }
        
        return (
            <div className="backgroundContainer">
                <div className="pageTitle">
                    {this.props.userInfo.username}'s Profile
                </div>
                {this.props.userInfo.isParent ?
                (
                    <div>
                        <h2>Your Clan</h2>
                        {this.props.userInfo.children.map(el =>
                            <p>
                                {el.username}: {el.exp} EXP, {el.coins} coins
                            </p>
                        )}
                        {this.props.userInfo.children.length ? null : <p>None yet - enlist an explorer below!</p>}
                        <br />
                        <h2>Enlist a New Explorer</h2>
                        <div>
                            <input id="username" className="accountField" name="username" type="text" onChange={this.handleChange} placeholder="Username" />
                        </div>
                        <div>
                            <input id="password" className="accountField" name="password" type="password" onChange={this.handleChange} placeholder="Password" />
                        </div>
                        <div>
                            <input id="password2" className="accountField" name="password2" type="password" onChange={this.handleChange} placeholder="Confirm password" />
                        </div>
                        <button type="button" class={classNames("btn", "btn-secondary", {"disabled": !this.childFormComplete()})} onClick={this.addChild}>Register Explorer</button>
                    </div>
                )
                :
                (
                    <div>
                        <h2>Stats</h2>
                        <p>
                            You've gained <strong>{this.props.userInfo.exp}</strong> EXP! You also have <strong>{this.props.userInfo.coins}</strong> coins to spend!
                        </p>
                        <h2>Your Clan</h2>
                        <p>
                            {this.props.userInfo.username} (you): {this.props.userInfo.exp} EXP
                        </p>
                        {this.props.userInfo.siblings.map(s => (<p>{s.username}: {s.exp} EXP</p>))}
                        <p>
                            You are in <strong>{place}</strong> place!
                        </p>
                        </div>
                )}
                <img src="http://2.bp.blogspot.com/-cVAAIiL86ek/VMuM-EzBpEI/AAAAAAAAAB0/7UeEgpYfeCg/s1600/Clash_Troops.png"
                    style={{ position: "fixed", bottom: "-20px", right: "-20px", zIndex: "-1", maxHeight: "50vh"}} />
            </div>
        )
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    childFormComplete = () => {
        return this.state.username && this.state.password && this.state.password == this.state.password2;
    }

    addChild = () => {
        if (!this.childFormComplete()) {
            return;
        }
        axios.post('/api/add', {
            username: this.state.username,
            password: this.state.password,
        })
        .then(res => {
            alert(res.data.message);
        })
    }
}