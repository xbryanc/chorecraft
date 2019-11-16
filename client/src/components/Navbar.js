import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/app.css';
import '../css/root.css';

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false
        };
    }

    render() {
        return (
            <div className="navbarContainer navbar">
                <Link to="/quests">Quests</Link>
                <Link to="/market">Market</Link>
                { this.state.loggedIn ? null : 
                    <div>
                        <Link to="/child/login">Explorer Log In</Link>
                        <Link to="/parent/login">Questmaster Log In</Link>
                        <Link to="/parent/signup">Questmaster Sign Up</Link>
                    </div>
                }
                { !this.state.loggedIn ? null : 
                    <a href="/api/logout">Log Out</a>
                }
            </div>
        );
    }
}


