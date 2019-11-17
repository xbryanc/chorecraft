import React, { Component } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import '../../css/app.css';
import '../../css/login.css';

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
        if (!this.formCompleted()) {
            return;
        }
        axios.post('/api/login', {
            username: this.state.username,
            password: this.state.password,
            isParent: this.props.isParent,
        })
        .then(res => {
            if (res.data.redirect) {
                window.location = res.data.redirect;
            }
        })
        .catch((err) => {
            alert(err.response.data.message);
        })
    }

    formCompleted = () => {
        return this.state.username && this.state.password;
    }

    render() {
        return (
            <div className="loginContainer backgroundContainer">
                <div className="pageTitle">
                    {this.props.isParent ? "Questmaster Login" : "Explorer Login"}
                </div>
                <form>
                    <div>
                        <input className="accountField" type="text" name="username" value={this.state.username} onChange={this.handleChange} placeholder="Username" />
                    </div>
                    <div>
                        <input className="accountField" type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
                    </div>
                    <button type="button" className={classNames("btn", "btn-secondary", {"disabled": !this.formCompleted()})} onClick={this.handleLogin}>Log in</button>
                </form>
                <img className="loginImage" src={this.props.isParent ? "/media/detective.png" : "/media/journey.png"} />
            </div>
        );
    }
}
