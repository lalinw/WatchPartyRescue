import './App.css';
import React, { Component } from "react";
//Components
import FetchList from "./Components/FetchList";
import ListSummary from "./Components/ListSummary";
import SignIn from "./Components/SignIn";
import UserList from "./Components/UserList";
import Session from "./Components/Session";

//keys
import firebase from './firebase';

//import logo from './logo.svg';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      usernameMAL: null,
      sessionID: null,
      hasSession: false,
      usersInSessionCount: 0,
      isLoading: true
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

    this.loadingGIF = this.loadingGIF.bind(this);
    
  }

  componentDidMount() {

    //Sample address: http://localhost:3000/?param1=55&param2=test
    //note: 
    //  All URL parameters are strings
    //  When a parameter doesn't exist in the URL address, queryParams.get() method will return null
    const urlParam = new URLSearchParams(window.location.search);
    const sessionID = urlParam.get('session');

    console.log("Session ID = " + sessionID);
    // console.log(sessionID);

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

    this.loadingGIF(false);
  }

  componentDidUpdate() {
    this.loadingGIF(false);
  }

  resetUser() {
    this.loadingGIF(true);
    this.setState({
      user: null,
      usernameMAL: null,
    })
  }


  setUser(name) {
    this.loadingGIF(true);
    const sessionRef = firebase.firestore().collection("session").doc(this.state.sessionID);
    const usersRef = sessionRef.collection("users");

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
        user: name
      })
    }).then(() => {
      usersRef.doc(this.state.user).get().then((thisDoc) => {
        this.setState({
          user: name,
          usernameMAL: thisDoc.data().myanimelist_username
        })
      })
    });
  }


  resetSession() {
    this.loadingGIF(true);
    //log out of session && sign out of current user
    this.setState({
      sessionID: null,
      hasSession: false,
      user: null,
      usernameMAL: null
    })
    //remove sessionID from address bar
    window.location.href =  window.location.href.split("?")[0];
  }


  createSession() {
    this.loadingGIF(true);
    firebase.firestore().collection("session").add({
      session_name: "Session/Event Name",
      date_created: firebase.firestore.FieldValue.serverTimestamp(),
      users_count: 0
    }).then((doc) => {
      console.log("new session ID: " + doc.id);
      this.setSession(doc.id);
    }).catch((error) => {});
  }


  setSession(sessionID) {
    this.loadingGIF(true);
    this.setState({
      sessionID: sessionID,
      hasSession: true
    })
    const sessionRef = firebase.firestore().collection("session").doc(this.state.sessionID);
    sessionRef.get().then((thisSession) => {
      this.setState({
        usersInSessionCount: thisSession.data().users_count
      })
    });
  }

  
  setUsernameMAL(event, name) {
    this.loadingGIF(true);
    event.preventDefault();
    this.loadingGIF(true);
    
    const sessionRef = firebase.firestore().collection("session").doc(this.state.sessionID);
    const usersRef = sessionRef.collection("users");

    usersRef.doc(this.state.user).get().then((doc) => {
      // doc of user already exists if the user is trying to set their MAL username
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
        <h2>Watch Party Rescue <span class="material-icons"></span></h2>
        <p><i>(currently supporting <b>MyAnimeList's Plan to Watch</b> list only)</i></p>
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
      <div>

        <div class="banner">
          <this.topBanner/>
        </div>

        

          <Session
            sessionID = {this.state.sessionID}
            hasSession = {this.state.hasSession}
            resetSession = {this.resetSession}
            createSession = {this.createSession}
          />


          <SignIn
            user = {this.state.user}
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

            loadingGIF = {this.loadingGIF}
          />

        <div class="app-content">

          {this.state.hasSession ? 
          <UserList
            user = {this.state.user}
            sessionID = {this.state.sessionID}
          /> : <React.Fragment/>}
          

          {this.state.hasSession && this.state.user !== null ? 
            <React.Fragment>
              <FetchList
                user = {this.state.user}
                usernameMAL = {this.state.usernameMAL}
                sessionID = {this.state.sessionID}
                hasSession = {this.state.hasSession}
                //methods
                setUsernameMAL = {this.setUsernameMAL}
                loadingGIF = {this.loadingGIF}
              /> 
              <ListSummary
                sessionID = {this.state.sessionID}
                hasSession = {this.state.hasSession}
                usersInSessionCount = {this.state.usersInSessionCount}
                loadingGIF = {this.loadingGIF}
              />
            </React.Fragment>
            : <React.Fragment/>}


        </div>
      
        
      </div>
    );
  }

}

export default App;
