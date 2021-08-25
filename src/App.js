import './App.css';
import React, { Component } from "react";
import FetchList from "./Components/FetchList";
import ListSummary from "./Components/ListSummary";
import SignIn from "./Components/SignIn";
import firebase from './firebase';

//import logo from './logo.svg';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: "Irene",
      usernameMAL: "zaphriz",
      sessionID: "wJGmnGUM6JpqiXab2gby",
      hasSession: false
    };
    this.topBanner = this.topBanner.bind(this);
  }

  componentDidMount() {

    //Sample address: http://localhost:3000/?param1=55&param2=test
    //note: 
    //  All URL parameters are strings
    //  When a parameter doesn't exist in the URL address, queryParams.get() method will return null
    const urlParam = new URLSearchParams(window.location.search);
    const session = urlParam.get('s');
    // http://localhost:3000/?s=wJGmnGUM6JpqiXab2gby

    if (session != null) {
      this.setState({
        sessionID: session,
        hasSession: true
      });
    }
  }

  topBanner() {
    return(
      <h3>Watch Party Rescue <span class="material-icons"></span></h3>
    );
  }
  
  render() {
    return (
      <div>

        <div class="banner">
          <this.topBanner/>
        </div>

        <div class="outer">
          <SignIn
            sessionID = {this.state.sessionID}
            hasSession = {this.state.hasSession}
          />
          <FetchList/>
          <ListSummary/>
        </div>

      </div>
    );
  }

}

export default App;
