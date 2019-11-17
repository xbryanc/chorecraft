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
            <div>
                <h1>Market</h1>
                {Object.keys(this.props.userInfo).length ?
                    <div>
                        {this.props.userInfo.isParent ?
                            <div>
                                <h2>Create a Reward</h2>
                                {[["Title", "text"], ["Description", "text"], ["Cost", "number"]].map((cur, i) => {
                                    let el = cur[0];
                                    let type = cur[1];
                                    return (
                                        <div key={i.toString()}>
                                            <label htmlFor={`reward${el}`}>{el}:</label>
                                            <input id={`reward${el}`} name={el.toLowerCase()} type={type} onChange={this.changeState}></input>
                                        </div>
                                    );
                                })} 
                                <button type="button" className="btn btn-secondary" onClick={this.createReward}>Create!</button>
                            </div>
                            : <h2>Coins: {this.props.userInfo.coins}</h2>
                        }
                        {this.state.rewards.map((reward, i) => {
                            return (
                                reward.purchasedBy.indexOf(this.props.userInfo._id) == -1 ?
                                <div key={i.toString()}>
                                    <h4>{reward.title}</h4>
                                    <p>{reward.description}</p>
                                    <p>Cost: {reward.cost}</p>
                                    {this.props.userInfo.isParent ?
                                        <div>
                                            <h6>Purchased by</h6>
                                            <ul>
                                                {this.props.userInfo.children.map((child, ci) => {
                                                    return (reward.purchasedBy.indexOf(child._id) != -1 
                                                        ? <li key={ci.toString()}>{child.username}</li> 
                                                        : null);
                                                })}
                                            </ul>
                                        </div>
                                        :
                                        <div>
                                            {this.props.userInfo.coins >= reward.cost ?
                                                <button type="button" className="btn btn-secondary" onClick={this.purchaseReward(reward._id)}>Purchase!</button>
                                                : <p>Sorry, you need {reward.cost - this.props.userInfo.coins} more coins</p>
                                            }
                                        </div>
                                    }
                                </div>
                                : null
                            );
                        })
                        }
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