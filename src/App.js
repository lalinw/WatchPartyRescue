import './App.css';
import React, { Component } from "react";
import FetchList from "./Components/FetchList";
import ListSummary from "./Components/ListSummary";
import SignIn from "./Components/SignIn";
import UserList from "./Components/UserList";
import firebase from './firebase';

//import logo from './logo.svg';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      hasUser: false,
      usernameMAL: null,
      sessionID: null,
      hasSession: false,
      usersInSessionCount: 0,
      sessionName: null
    };
    //mini components
    this.topBanner = this.topBanner.bind(this);

    //session methods
    this.resetSession = this.resetSession.bind(this);
    this.createSession = this.createSession.bind(this);
    this.setSession = this.setSession.bind(this);
    //user methods
    this.resetUser = this.resetUser.bind(this);
    this.setUser = this.setUser.bind(this);
    //MAL user methods
    this.setUsernameMAL = this.setUsernameMAL.bind(this);
    this.resetUsernameMAL = this.resetUsernameMAL.bind(this);
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
    // http://localhost:3000/?session=FEHY0ymsqQuX28YISnC7
    // http://localhost:3000/?session=nAXdMY0ZCO7PmsmiWbQL 

    if (sessionID != null) {

      //check if session does actually exist/valid sessionID
      firebase.firestore().collection("session").doc(sessionID)
                          .collection("users")
                          .get().then((usersCollection) => {
                            this.setState({
                              sessionID: sessionID,
                              hasSession: true,
                              usersInSessionCount: usersCollection.size
                            });
      });
      console.log("users count = " + this.state.usersInSessionCount);
    }
  }

  resetUser() {
    this.setState({
      user: null,
      hasUser: false,
      usernameMAL: null,
    })
  }

  setUser(name) {
    var sessionRef = firebase.firestore().collection("session").doc(this.state.sessionID);
    var usersRef = sessionRef.collection("users");

    usersRef.doc(name).get().then((thisDoc) => {
      if (!thisDoc.exists) {
        console.log("doc does not exist yet. Creating user...");
        usersRef.doc(name).set({
          myanimelist_username: null
        });
        sessionRef.update({
          users_count: firebase.firestore.FieldValue.increment(1)
        });
      }
      this.setState({
        user: name,
        hasUser: true
      })
    }).then(() => {
      usersRef.doc(this.state.user).get().then((thisDoc) => {
        this.setState({
          user: name,
          hasUser: true,
          usernameMAL: thisDoc.data().myanimelist_username
        })
      })
      
    });
  }

  resetSession() {
    //log out of session && sign out of current user
    this.setState({
      sessionID: null,
      hasSession: false,
      user: null,
      hasUser: false,
      usernameMAL: null
    })
  }

  createSession() {
    var newSession = firebase.firestore().collection("session").add({
      session_name: "Session/Event Name",
      date_created: firebase.firestore.FieldValue.serverTimestamp(),
      users_count: 0
    }).then((doc) => {
      console.log("new session ID: " + doc.id);
      this.setSession(doc.id);
    }).catch((error) => {});
  }

  setSession(sessionID) {
    this.setState({
      sessionID: sessionID,
      hasSession: true
    })
    var sessionRef = firebase.firestore().collection("session").doc(this.state.sessionID);
    sessionRef.get().then((thisSession) => {
      this.setState({
        usersInSessionCount: thisSession.data().users_count
      })
    });
  }

  setUsernameMAL(event, name) {
    event.preventDefault();
    
    var sessionRef = firebase.firestore().collection("session").doc(this.state.sessionID);
    var usersRef = sessionRef.collection("users");

    usersRef.doc(this.state.user).get().then((doc) => {
      // if (!doc.exists) {
        
      // }
      console.log("setting user's MAL username..." + name);
      usersRef.doc(this.state.user).update({
        myanimelist_username: name,
      });
    });
    this.setState({
      usernameMAL: name
    })
  }

  resetUsernameMAL() {
    this.setState({
      usernameMAL: null,
    })
  }

  topBanner() {
    return(
      <div class="banner-inner">
        <h3>Watch Party Rescue <span class="material-icons"></span></h3>
      </div>
    );
  }
  
  render() {
    return (
      <div>

        <div class="banner">
          <this.topBanner/>
        </div>

        <div class="app-content">
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
            setUsernameMAL = {this.setUsernameMAL}
            resetUsernameMAL = {this.resetUsernameMAL}
          />
          {this.state.hasSession ? 
          <UserList
            user = {this.state.user}
            sessionID = {this.state.sessionID}
          /> : <React.Fragment/>}
          {this.state.hasSession && this.state.hasUser ? 
            <FetchList
            user = {this.state.user}
            hasUser = {this.state.hasUser}
            usernameMAL = {this.state.usernameMAL}
            sessionID = {this.state.sessionID}
            hasSession = {this.state.hasSession}
            //methods
            setUsernameMAL = {this.setUsernameMAL}
          /> : <React.Fragment/>}
            
          {this.state.hasSession && this.state.hasUser ? 
            <ListSummary
            sessionID = {this.state.sessionID}
            hasSession = {this.state.hasSession}
            usersInSessionCount = {this.state.usersInSessionCount}
          /> : <React.Fragment/>}

        </div>
      </div>
    );
  }

}

export default App;
