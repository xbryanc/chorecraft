import React, { Component } from 'react';
import '../../css/app.css';
import '../../css/market.css';

export default class Market extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.props.updateUserInfo();
    }

    componentDidMount() {
        document.title = "Coin Market";
    }

    render() {
        return (
            <div>
                Hello.
            </div>
        )
    }
}