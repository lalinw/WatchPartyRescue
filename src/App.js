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
      sessionID: "",
      hasSession: false,
      usersInSessionCount: 0
    };
    this.topBanner = this.topBanner.bind(this);
  }

  componentDidMount() {

    //Sample address: http://localhost:3000/?param1=55&param2=test
    //note: 
    //  All URL parameters are strings
    //  When a parameter doesn't exist in the URL address, queryParams.get() method will return null
    const urlParam = new URLSearchParams(window.location.search);
    const sessionID = urlParam.get('s');

    console.log("URL parameter = " + urlParam);
    console.log(sessionID);
    // http://localhost:3000/?s=FEHY0ymsqQuX28YISnC7

    if (sessionID != null) {
      firebase.firestore().collection("session").doc(sessionID)
                          .collection("users")
                          .get().then((usersCollection) => {
                            this.setState({
                              sessionID: sessionID,
                              hasSession: true,
                              usersInSessionCount: usersCollection.size
                            });
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
            usersInSessionCount = {this.state.usersInSessionCount}
          />
          {this.state.hasSession ? 
            <FetchList
            sessionID = {this.state.sessionID}
            hasSession = {this.state.hasSession}
          /> : <React.Fragment/>}
            
          {this.state.hasSession ? 
            <ListSummary
            sessionID = {this.state.sessionID}
            hasSession = {this.state.hasSession}
            usersInSessionCount = {this.state.usersInSessionCount}
          /> : <React.Fragment/>}
          
          
          
        </div>
        
        {this.state.hasSession? 
          <button onClick={() => {
            navigator.clipboard.writeText("http://localhost:3000/" + window.location.search)}}>
            Share Session Link!
          </button> 
        : <React.Fragment/>}
      </div>
    );
  }

}

export default App;
