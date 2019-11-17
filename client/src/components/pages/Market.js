import React, { Component } from 'react';
import axios from 'axios';
import '../../css/app.css';
import '../../css/market.css';

export default class Market extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rewards: [],
        };
        this.props.updateUserInfo();
    }

    componentDidMount() {
        document.title = "Coin Market";
        this.getRewards();
    }

    render() {
        return (
            <div className="backgroundContainer">
                <h1 className="pageTitle">Market</h1>
                {Object.keys(this.props.userInfo).length ?
                    <div>
                        {this.props.userInfo.isParent ?
                            <div>
                                <h2>Create a Reward!</h2>
                                {[["Title", "text", "Cookie"], ["Description", "text", "If you give a mouse a cookie..."], ["Cost", "number", 2]].map((cur, i) => {
                                    const el = cur[0];
                                    const type = cur[1];
                                    const placeholder = cur[2];
                                    return (
                                        <div key={i.toString()} className="form-group row">
                                            <label htmlFor={`reward${el}`} className="col-sm-2 col-form-label">{el}:</label>
                                            <input id={`reward${el}`} className="col-sm-10 form-control" name={el.toLowerCase()} placeholder={placeholder} type={type} onChange={this.changeState}></input>
                                        </div>
                                    );
                                })} 
                                <button type="button" className="btn btn-secondary" onClick={this.createReward}>Create!</button>
                            </div>
                            : <h2>Coins: {this.props.userInfo.coins}</h2>
                        }
                        <br />
                        <h2>Rewards</h2>
                        <div className="card-deck">
                            {this.state.rewards.map((reward, i) => {
                                return (
                                    reward.purchasedBy.indexOf(this.props.userInfo._id) == -1 ?
                                        <div key={i.toString()} className="card">
                                            <div className="card-body">
                                                <h5 className="card-title">{reward.title}</h5>
                                                <h6 className="card-subtitle mb-2 text-muted">Cost: {reward.cost}</h6>
                                                <p className="card-text">{reward.description}</p>
                                            </div>
                                            <div className="card-footer">
                                                {this.props.userInfo.isParent ?
                                                    <div>
                                                        <p className="card-text">Purchased by 
                                                            {": " +
                                                                (this.props.userInfo.children
                                                                    .filter(child => reward.purchasedBy.indexOf(child._id) != -1)
                                                                    .map(child => child.username)
                                                                    .join(", "))
                                                            }
                                                        </p>
                                                    </div>
                                                    :
                                                    <div>
                                                        {this.props.userInfo.coins >= reward.cost ?
                                                            <button type="button" className="btn btn-secondary" onClick={this.purchaseReward(reward._id)}>Purchase!</button>
                                                            : 
                                                            <div>
                                                                <button type="button" className="btn btn-secondary" disabled>Purchase!</button>
                                                                <p className="card-text"><small className="text-muted">You need {reward.cost - this.props.userInfo.coins} more coins</small></p>
                                                            </div>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        : null
                                );
                            })
                            }
                        </div>
                    </div>
                    :
                    <div>
                        Please log in to view the market.
                    </div>
                }
            </div>
        )
    }

    getRewards = () => {
        fetch("/api/getRewards")
        .then(res => res.json())
        .then(res => {
            this.setState({ rewards: res });
        });
    }

    changeState = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    completedRewardFields = () => {
        return this.state.title && this.state.description && this.state.cost;
    }

    createReward = () => {
        if (!this.completedRewardFields()) {
            return;
        }
        axios.post('/api/createReward', {
            title: this.state.title,
            description: this.state.description,
            cost: this.state.cost,
        })
        .then(res => {
            this.getRewards();
        })
        .catch(err => {
            alert(err.response.data.message);
        });
    }

    purchaseReward = (rewardId) => {
        return (e) => {
            axios.post('/api/purchaseReward', {
                rewardId: rewardId
            })
            .then(res => {
                this.props.updateUserInfo();
                this.getRewards();
            })
            .catch(err => {
                alert(err.response.data.message);
            });
        };
    }
}