import React, { Component } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import Reward from '../Reward';
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
                <div className="pageTitle">Market</div>
                {Object.keys(this.props.userInfo).length ?
                    <div className="marketContent">
                        {this.props.userInfo.isParent ?
                            <div>
                                <h2 className="marketSection">Create a Reward!</h2>
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
                                <button type="button" className={classNames("btn", "btn-secondary", {"disabled": !this.completedRewardFields()})} onClick={this.createReward}>Create!</button>
                            </div>
                            : <h2>{this.props.userInfo.coins}<img className="profileCoins" src="/media/coins.png" /></h2>
                        }
                        <br />
                        <h2 className="marketSection">Rewards</h2>
                        <div className="card-deck">
                            {this.state.rewards.map((reward, i) => {
                                return (<Reward key={i.toString()} reward={reward}
                                    onUpdate={() => { this.props.updateUserInfo(); this.getRewards(); }}
                                    userInfo={this.props.userInfo} />);
                            })
                            }
                        </div>
                    </div>
                    :
                    <div>
                        Please log in to view the market.
                    </div>
                }
                <img src="https://www.hearthstonetopdecks.com/wp-content/uploads/2018/02/card-back-azeroth-is-burning-197x300.png"
                    style={{ position: "fixed", bottom: "20px", left: "20px", zIndex: "-1", transform: "rotate(20deg)"}} />
                <img src="https://wiki.teamfortress.com/w/images/thumb/f/f5/Towering_Pillar_of_Hats.png/250px-Towering_Pillar_of_Hats.png"
                    style={{ position: "fixed", bottom: "0", right: "20px", zIndex: "-1"}} />
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
}