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
      user: "",
      hasUser: false,
      usernameMAL: "",
      sessionID: "",
      hasSession: false,
      usersInSessionCount: 0
    };
    this.topBanner = this.topBanner.bind(this);
    this.resetSession = this.resetSession.bind(this);
    this.resetUser = this.resetUser.bind(this);
    this.createSession = this.createSession.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setSession = this.setSession.bind(this);

  }

  componentDidMount() {

    //Sample address: http://localhost:3000/?param1=55&param2=test
    //note: 
    //  All URL parameters are strings
    //  When a parameter doesn't exist in the URL address, queryParams.get() method will return null
    const urlParam = new URLSearchParams(window.location.search);
    const sessionID = urlParam.get('session');

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

  resetUser() {
    this.setState({
      user: "",
      hasUser: false
    })
  }

  setUser(name) {
    this.setState({
      user: name,
      hasUser: true
    })
  }

  resetSession() {
    this.setState({
      sessionID: "",
      hasSession: false
    })
  }

  createSession() {
    var newSession = firebase.firestore().collection("session").add({
      session_name: "Session/Event Name",
      date_created: firebase.firestore.FieldValue.serverTimestamp()
    }).then((doc) => {
      console.log("new session ID: " + doc.id);
      this.setState({
        sessionID: doc.id,
        hasSession: true
      })
    }).catch((error) => {});
  }

  setSession(sessionID) {
    this.setState({
      sessionID: sessionID,
      hasSession: true
    })
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
            user = {this.state.user}
            hasUser = {this.state.hasUser}
            sessionID = {this.state.sessionID}
            hasSession = {this.state.hasSession}
            usersInSessionCount = {this.state.usersInSessionCount}
            //methods
            resetSession = {this.resetSession}
            createSession = {this.createSession}
            resetUser = {this.resetUser}
            setUser = {this.setUser}
          />
          {this.state.hasSession ? 
            <FetchList
            user = {this.state.user}
            hasUser = {this.state.hasUser}
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
