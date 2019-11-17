import React, { Component } from 'react';
import { Slide } from 'react-slideshow-image';
import '../../css/app.css';
import '../../css/root.css';

export default class Root extends Component {
    constructor(props) {
        super(props);
        this.props.updateUserInfo();
    }

    componentDidMount() {
        document.title = "Chorecraft";
    }
    
    render() {
        return (
            <div className="rootContainer backgroundContainer">
                <div className="pageTitle">
                    Welcome to Chorecraft!
                </div>
                <div className="rootSlideContainer">
                    <Slide className="rootSlideshow"
                        duration={5000}
                        transitionDuration={500}
                        infinite={true}
                        indicators={true}
                        arrows={true}
                    >
                        {[
                            ["/media/quest.jpg", "Browse quests to do."],
                            ["/media/coins.png", "Earn coins by completing quests."],
                            ["/media/redeem.jpeg", "Cash in coins for rewards!"],
                            ["/media/exp.jpeg", "Quests also reward EXP for more benefits!"]
                        ].map(slide =>
                        <div className="rootSlide">
                            <img className="rootSlideImage" src={slide[0]} />
                            <div className="rootSlideInfo">
                                {slide[1]}
                            </div>
                        </div>
                        )}
                    </Slide>
                </div>
                {Object.keys(this.props.userInfo).length ? null :
                <div className="rootLoginButtons">
                    <button type="button" className="btn btn-secondary rootLoginButton" onClick={() => this.redirect("/child/login")}>
                        Explorer Login
                    </button>
                    <button type="button" className="btn btn-secondary rootLoginButton" onClick={() => this.redirect("/parent/login")}>
                        Questmaster Login
                    </button>
                    <button type="button" className="btn btn-secondary rootLoginButton" onClick={() => this.redirect("/parent/signup")}>
                        Questmaster Registration
                    </button>
                </div>
                }
            </div>
        );
    }

    redirect = (url) => {
        window.location.href = url;
    }
}