import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import '../css/app.css';
import '../css/navbar.css';
import icon from "../../public/media/navbar.svg"

export default class Navbar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let curPath = window.location.pathname;
        return (
            <nav className="navbar navbar-expand-lg" onClick={this.rerender}>
                <Link to="/" className="navbar-brand nav-link">Chorecraft</Link>
                <div className="navbar-nav">
                    <Link to="/quests" className={classNames("nav-item", "nav-link", {"nav-current": curPath.startsWith("/quests")})}>Quests</Link>
                    <Link to="/market" className={classNames("nav-item", "nav-link", {"nav-current": curPath.startsWith("/market")})}>Market</Link>
                    <div className="nav-item dropdown">
                        <img className="nav-link dropdown-toggle profileIcon" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" src={icon}/>
                        { !Object.keys(this.props.userInfo).length ?
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                            <div className="helpDiv" />
                            <Link to="/child/login" className="dropdown-item">Explorer Log In</Link>
                            <Link to="/parent/login" className="dropdown-item">Questmaster Log In</Link>
                            <Link to="/parent/signup" className="dropdown-item">Questmaster Sign Up</Link>
                        </div>
                        :
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                            <div className="helpDiv" />
                            <Link to="/profile" className="dropdown-item">Profile</Link>
                            <a className="dropdown-item" href="/api/logout">Log Out</a>
                        </div>
                        }
                    </div>
                </div>
            </nav>
        );
    }

    rerender = () => {
        this.forceUpdate();
    }
}


