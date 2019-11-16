import React, { Component } from 'react';
import axios from 'axios';
import '../../css/App.css';
import '../../css/root.css';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            isParent: this.props.isParent,
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    componentDidMount() {
        document.title = "Questmaster Login - Chorecraft";
    }

    handleUsernameChange(e) {
        this.setState(username: e.target.value);
    }

    handlePasswordChange(e) {
        this.setState(password: e.target.value);
    }

    handleLogin() {
        axios.post('/api/login', {
            username: this.state.username,
            password: this.state.password,
            isParent: this.props.isParent,
        }).then((res) => {
            if (res.data.redirect) {
                window.location = res.data.redirect;
            }
        }).catch((err) => {
            alert(err);
        })
    }

    render() {
        return (
            <div className="loginContainer">
                <form>
                    <div>
                        <label>Username:</label>
                        <input type="text" name="username" value={this.state.username} onChange={this.handleUsernameChange} />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" name="password" value={this.state.password} onChange={this.handlePasswordChange} />
                    </div>
                    <button type="button" onClick={this.handleLogin}>Log in</button>
                </form>
            </div>
        );
    }
}
