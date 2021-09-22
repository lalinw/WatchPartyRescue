import React, { Component } from "react";


class Banner extends Component {
  constructor() {
    super();
    this.state = {
    };
    //static views
    this.TopBannerView = this.TopBannerView.bind(this);
    this.CreditsBannerView = this.CreditsBannerView.bind(this);
  }

  componentDidMount() {
  }

  
  TopBannerView() {
    return(
      <div className="banner-inner" id="banner-top">
        <h2>Watch Party Rescue <span className="material-icons"></span></h2>
      </div>
    );
  }


  CreditsBannerView() {
    return(
      <div className="banner-inner footer">
        <div className="footer-inner footer">
          <h3>Developer:</h3>
          <p>Irene W.</p>
          <a href="https://github.com/lalinw/WatchPartyRescue/">Github</a>
        </div>
        <div className="footer-inner footer">
          <h3>Brought to you using:</h3>
          <a href="https://reactjs.org/">ReactJS</a>
          <br/>
          <a href="https://jikan.moe/">Jikan API</a>
        </div>
      </div>
    );
  }
  

  render() {
    return (
      <React.Fragment>

        <div className="banner" id="banner">
          <this.TopBannerView/>
        </div>

        <div className="banner" id="footer">
          <this.CreditsBannerView/>
        </div>

      </React.Fragment>
    );
  }

}

export default Banner;
