import './App.css';
import React, { Component } from "react";
//Components
import FetchList from "./Components/FetchList";
import ListSummary from "./Components/ListSummary";
import SignIn from "./Components/Signin";
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
      usersInSessionCount: null,
      isLoading: false
    };
    //views
    this.TopBannerView = this.TopBannerView.bind(this);

    //session methods
    this.resetSession = this.resetSession.bind(this);
    this.createSession = this.createSession.bind(this);
    this.setSession = this.setSession.bind(this);
    //user methods
    this.resetUser = this.resetUser.bind(this);
    this.setUser = this.setUser.bind(this);
    this.recountUsers = this.recountUsers.bind(this);
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
      const sessionRef = firebase.firestore().collection("session").doc(sessionID);
      sessionRef.get().then((thisSession) => {
        if (thisSession.exists) {
          //if session already exist, access the session
          sessionRef.collection("users")
          .get().then((usersCollection) => {
            this.setState({
              sessionID: sessionID,
              usersInSessionCount: usersCollection.size
            });
          });
        }
        //reset the URL in the address bar
        navigator.clipboard.writeText(window.location.href.split("?")[0]);         
      });
      console.log("users count = " + this.state.usersInSessionCount);
    }
    this.loadingGIF(false);
  }


  componentDidUpdate() {
    // this.loadingGIF(false);
  }


  resetUser() {
    // this.loadingGIF(true);
    this.setState({
      user: null,
      usernameMAL: null,
    })
  }

  
  recountUsers() {
    firebase.firestore().collection("session").doc(this.state.sessionID)
    .get().then((thisSession) => {
      this.setState({
        usersInSessionCount: thisSession.data().users_count
      })
    });
  }


  setUser(name) {
    // this.loadingGIF(true);
    this.setState({
      user: name
    })
    const sessionRef = firebase.firestore().collection("session").doc(this.state.sessionID);
    const usersRef = sessionRef.collection("users");

    usersRef.doc(name).get().then((thisDoc) => {
      if (!thisDoc.exists) {
        console.log("doc does not exist yet. Creating user...");
        
        this.setState((state) => ({
          usersInSessionCount: state.usersInSessionCount + 1
        }))

        sessionRef.update({
          users_count: firebase.firestore.FieldValue.increment(1)
        });

        usersRef.doc(name).set({
          myanimelist_username: null
        });
      } else {
        this.setState({
          user: name,
          usernameMAL: thisDoc.data().myanimelist_username
        })
      }
    });
    
    // .then(() => {
    //   // usersRef.doc(this.state.user).get().then((thisDoc) => {
    //   //   this.setState({
    //   //     user: name,
    //   //     usernameMAL: thisDoc.data().myanimelist_username
    //   //   })
    //   // })
    //   this.recountUsers();
    // });
  }


  resetSession() {
    // this.loadingGIF(true);
    //log out of session && sign out of current user
    this.setState({
      sessionID: null,
      user: null,
      usernameMAL: null,
      usersInSessionCount: null
    })
    //remove sessionID from address bar
    window.location.href =  window.location.href.split("?")[0];
  }


  createSession(sessionName) {
    // this.loadingGIF(true);
    
    firebase.firestore().collection("session").add({
      session_name: sessionName,
      date_created: firebase.firestore.FieldValue.serverTimestamp(),
      users_count: 0
    }).then((doc) => {
      console.log("new session ID: " + doc.id);
      this.setSession(doc.id);
    }).catch((error) => {});
  }


  setSession(sessionID) {
    // this.loadingGIF(true);
    this.setState({
      sessionID: sessionID
    })
    this.recountUsers();
  }

  
  setUsernameMAL(event, name) {
    // this.loadingGIF(true);
    event.preventDefault();

    const usersRef = firebase.firestore().collection("session").doc(this.state.sessionID).collection("users");

    usersRef.doc(this.state.user)
    .get().then((doc) => {
      // doc of user already exists if the user is trying to set their MAL username
      console.log("setting user's MAL username as..." + name);
      usersRef.doc(this.state.user).update({
        myanimelist_username: name
      });
    });
    this.setState({
      usernameMAL: name
    })
  }


  resetUsernameMAL() {
    this.setState({
      usernameMAL: null
    })
  }



  TopBannerView() {
    return(
      <div className="banner-inner">
        <h2>Watch Party Rescue <span className="material-icons"></span></h2>
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
        <div className="banner" id="banner">
          <this.TopBannerView/>
        </div>
          <Session
            sessionID = {this.state.sessionID}
            resetSession = {this.resetSession}
            createSession = {this.createSession}
            loadingGIF = {this.loadingGIF}
          />
        <div className="app-content"> 
          <SignIn
            user = {this.state.user}
            sessionID = {this.state.sessionID}
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
          {/* {this.state.sessionID != null && <UserList
                                      user = {this.state.user}
                                      sessionID = {this.state.sessionID}
                                    />} */}
          {this.state.sessionID != null && this.state.user !== null && <React.Fragment>
                                                                  <FetchList
                                                                    user = {this.state.user}
                                                                    usernameMAL = {this.state.usernameMAL}
                                                                    sessionID = {this.state.sessionID}
                                                                    //methods
                                                                    setUsernameMAL = {this.setUsernameMAL}
                                                                    loadingGIF = {this.loadingGIF}
                                                                  /> 
                                                                  <ListSummary
                                                                    sessionID = {this.state.sessionID}
                                                                    usersInSessionCount = {this.state.usersInSessionCount}
                                                                    loadingGIF = {this.loadingGIF}
                                                                  />
                                                                </React.Fragment>}
        </div>
      </div>
    );
  }

}

export default App;
