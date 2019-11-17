import React, { Component } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import '../../css/app.css';
import '../../css/signup.css';

export default class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            password2: "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
    }

    componentDidMount() {
        document.title = "Questmaster Signup - Chorecraft";
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    signupFormComplete = () => {
        return this.state.username && this.state.password && this.state.password == this.state.password2;
    }

    handleSignup() {
        if (!this.signupFormComplete()) {
            return;
        }
        axios.post('/api/signup', {
            username: this.state.username,
            password: this.state.password,
        }).then((res) => {
            if (res.data.redirect) {
                window.location = res.data.redirect;
            }
        }).catch((err) => {
            alert(err.response.data.message);
        })
    }

    render() {
        return (
            <div className="signupContainer backgroundContainer">
                <div className="pageTitle">
                    Questmaster Registration
                </div>
                <form>
                    <div>
                        <input className="accountField" type="text" name="username" value={this.state.username} onChange={this.handleChange} placeholder="Username" />
                    </div>
                    <div>
                        <input className="accountField" type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
                    </div>
                    <div>
                        <input className="accountField" type="password" name="password2" value={this.state.password2} onChange={this.handleChange} placeholder="Confirm password" />
                    </div>
                    <button type="button" className={classNames("btn", "btn-secondary", {"disabled": !this.signupFormComplete()})} onClick={this.handleSignup}>Sign up</button>
                </form>
                <img className="signupImage" src="/media/detective.png" />
            </div>
        );
    }
}

