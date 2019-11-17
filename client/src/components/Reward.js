import React, { Component } from 'react';
import axios from 'axios';
import '../css/app.css';

export default class Reward extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const reward = this.props.reward;
        const coinsNeeded = reward.cost - this.props.userInfo.coins;
        const daysNeeded = coinsNeeded / this.getEarningRate();
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
                                                You need {reward.cost - this.props.userInfo.coins} more coins. Work at your current rate for {daysNeeded} more days!
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
        // TODO use history
        return 2;
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