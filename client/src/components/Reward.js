import React, { Component } from 'react';
import axios from 'axios';
import '../css/app.css';

export default class Reward extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let reward = 0;
        let coinsNeeded = 0;
        let earningRate = 0;
        let subtext = "";
        if (!this.props.userInfo.isParent) {
            reward = this.props.reward;
            coinsNeeded = reward.cost - this.props.userInfo.coins;
            earningRate = this.getEarningRate();
            subtext = `You need ${coinsNeeded.toString()} more coins. ${earningRate > 0 ? "Should take " + Math.ceil(coinsNeeded / earningRate).toString() + " more days!" : "Get to work!"}`
        }
        return (
            reward.purchasedBy.indexOf(this.props.userInfo._id) == -1 ?
                <div className="card">
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
                                <div className="btn-group">
                                    {coinsNeeded <= 0 ?
                                        <button type="button" className="btn btn-secondary" onClick={this.purchaseReward(reward._id)}>Purchase!</button>
                                        :
                                        <button type="button" className="btn btn-secondary" disabled>Purchase!</button>
                                    }
                                    {this.props.userInfo.wishlistIds.indexOf(reward._id) == -1 ?
                                        <button type="button" className="btn btn-primary" onClick={this.addToWishlist(reward._id)}>Add to Wishlist</button>
                                        :
                                        <button type="button" className="btn btn-primary" disabled>Added to Wishlist</button>
                                    }
                                </div>
                                <div>
                                    {coinsNeeded <= 0 ?
                                        null
                                        :
                                        <div>
                                            <p className="card-text"><small className="text-muted">
                                                {subtext}
                                            </small></p>
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
                : null
        );
    }

    getEarningRate = () => {
        // get average amount earned over some number of days
        const numDays = 7;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - numDays);
        let earned = 0;
        if (this.props.userInfo.hasOwnProperty('transactions')) {
            this.props.userInfo.transactions.forEach(t => {
                if (t.timestamp >= cutoff && t.isQuest) {
                    earned += t.newCoins - t.oldCoins;
                }
            });
        }
        return Math.ceil(earned / numDays);
    }

    purchaseReward = (rewardId) => {
        return (e) => {
            axios.post('/api/purchaseReward', {
                rewardId: rewardId
            })
            .then(res => {
                this.props.onUpdate();
            })
            .catch(err => {
                alert(err.response.data.message);
            });
        };
    }

    addToWishlist = (rewardId) => {
        return (e) => {
            axios.post('/api/addToWishlist', {
                rewardId: rewardId
            })
            .then(res => {
                this.props.onUpdate();
            })
            .catch(err => {
                alert(err.response.data.message);
            })
        }
    }
}