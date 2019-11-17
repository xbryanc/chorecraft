import React, { Component } from 'react';
import axios from 'axios';
import '../../css/app.css';
import '../../css/profile.css';

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
                <div className="profileLogin">
                    Please log in to see profiles!
                </div>
            )
        }
        return (
            <div>
                Hi {this.props.userInfo.username}!
                {this.props.userInfo.isParent ?
                (
                    <div>
                        Current explorers:
                            {this.props.userInfo.childNames.map(el =>
                                <p>
                                    {el}
                                </p>
                            )}
                        Register an explorer!
                        <div>
                            <label htmlFor="username">Username:</label>
                            <input id="username" name="username" type="text" onChange={this.handleChange} />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input id="password" name="password" type="password" onChange={this.handleChange} />
                        </div>
                        <div>
                            <label htmlFor="password2">Confirm password:</label>
                            <input id="password2" name="password2" type="password" onChange={this.handleChange} />
                        </div>
                        <button onClick={this.addChild}>Register Explorer</button>
                    </div>
                )
                :
                (
                    <div>
                        Hello
                    </div>
                )}
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