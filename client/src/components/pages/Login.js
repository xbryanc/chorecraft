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
            isParent: this.props.isParent,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    componentDidMount() {
        document.title = this.state.isParent ? "Questmaster" : "Explorer" + " Login - Chorecraft";
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleLogin() {
        axios.post('/api/login', {
            username: this.state.username,
            password: this.state.password,
            isParent: this.props.isParent,
        })
        .then(res => {
            console.log("res");
            console.log(res);
            if (res.data.redirect) {
                window.location = res.data.redirect;
            }
        })
        .catch((err) => {
            alert("err");
            console.log("err");
            console.log(err.response);
        })
    }

    render() {
        return (
            <div className="loginContainer">
                <form>
                    <div>
                        <label>Username:</label>
                        <input type="text" name="username" value={this.state.username} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
                    </div>
                    <button type="button" onClick={this.handleLogin}>Log in</button>
                </form>
            </div>
        );
    }
}
