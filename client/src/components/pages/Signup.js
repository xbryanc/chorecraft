import React, { Component } from 'react';
import axios from 'axios';
import '../../css/app.css';
import '../../css/root.css';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
    }

    componentDidMount() {
        document.title = "Questmaster Signup - Chorecraft";
    }

    handleUsernameChange(e) {
        console.log("value");
        console.log(e.target.value);
        this.setState({username: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    handleSignup() {
        axios.post('/api/signup', {
            username: this.state.username,
            password: this.state.password,
        }).then((res) => {
            console.log("res");
            console.log(res);
            if (res.data.redirect) {
                window.location = res.data.redirect;
            }
        }).catch((err) => {
            alert(err.response.data.message);
        })
    }

    render() {
        return (
            <div className="signupContainer">
                <form>
                    <div>
                        <label>Username:</label>
                        <input type="text" name="username" value={this.state.username} onChange={this.handleUsernameChange} />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" name="password" value={this.state.password} onChange={this.handlePasswordChange} />
                    </div>
                    <button type="button" onClick={this.handleSignup}>Sign up</button>
                </form>
            </div>
        );
    }
}

