import React, { Component } from 'react';
import axios from 'axios';
import '../../css/app.css';
import '../../css/root.css';

export default class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
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

    handleSignup() {
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
            <div className="signupContainer">
                <form>
                    <div>
                        <label>Username:</label>
                        <input type="text" name="username" value={this.state.username} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
                    </div>
                    <button type="button" onClick={this.handleSignup}>Sign up</button>
                </form>
            </div>
        );
    }
}

