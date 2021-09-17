import './App.css';
import React, { Component } from "react";
//Components
import Session from "./Components/Session";


class App extends Component {
  constructor() {
    super();
    this.state = {
      sessionID: null,
      usersInSessionCount: null,
      isLoading: false
    };
    //views
    this.TopBannerView = this.TopBannerView.bind(this);
    this.CreditsBannerView = this.CreditsBannerView.bind(this);

    this.loadingGIF = this.loadingGIF.bind(this);
    
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
        <div className="footer-inner">
          <h3>Developer:</h3>
          <p>Irene W.</p>
          <a href="https://github.com/lalinw/WatchPartyRescue/">Github</a>
        </div>
        <div className="footer-inner">
          <h3>Brought to you using:</h3>
          <a href="https://reactjs.org/">ReactJS</a>
          <br/>
          <a href="https://jikan.moe/">Jikan API</a>
        </div>
      </div>
    );
  }
  

  loadingGIF(isLoading) {
    if (isLoading) {
      document.getElementById("popup-loading").style.display = "block";
      document.getElementById("popup-content").style.display = "block";
    } else {
      document.getElementById("popup-content").style.display = "none";
      document.getElementById("popup-loading").style.display = "none";
    }
  }


  render() {
    return (
      <React.Fragment>
        <div className="banner" id="banner">
          <this.TopBannerView/>
        </div>
          <Session
            loadingGIF = {this.loadingGIF}
          />
        <div className="banner" id="footer">
          <this.CreditsBannerView/>
        </div>
        </React.Fragment>
    );
  }

}

export default App;
