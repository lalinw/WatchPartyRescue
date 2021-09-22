/* 

CURRENT ISSUES:

1. Writing to Firestore takes ~1min to write, which seems super slow 
(currently circumventing UX issue by updating frontend before backend 
is finished writing)

2. Will need to disable button while that operation is not completed 
to prevent duplicate calls 

*/



import React from 'react';
import firebase from '../firebase';
//components
import SignIn from "./Signin";

class Session extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionID: null,
      sessionName: "",
      tempSessionName: "",
      editMode: false
    };
    this.createSession = this.createSession.bind(this);
    this.setSession = this.setSession.bind(this);
    this.setSessionName = this.setSessionName.bind(this);
    this.resetSession = this.resetSession.bind(this);
    this.handleSessionNameChange = this.handleSessionNameChange.bind(this);
    this.handleSessionNameSubmit = this.handleSessionNameSubmit.bind(this);
    this.handleSessionNameUpdate = this.handleSessionNameUpdate.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    //views
    this.EditableSessionNameView = this.EditableSessionNameView.bind(this);
    this.TextSessionNameView = this.TextSessionNameView.bind(this);
    this.ActiveSessionView = this.ActiveSessionView.bind(this);
    this.CreateSessionView = this.CreateSessionView.bind(this);
  }
  

  componentDidMount() {
    //Sample address: http://localhost:3000/?param1=55&param2=test
    //note: 
    //  All URL parameters are strings
    //  When a parameter doesn't exist in the URL address, queryParams.get() method will return null
    const urlParam = new URLSearchParams(window.location.search);
    const sessionID = urlParam.get('session');

    console.log("Session ID = " + sessionID);
    if (sessionID != null) {
      //check if session does actually exist/valid sessionID
      const sessionRef = firebase.firestore().collection("session").doc(sessionID);
      return sessionRef.onSnapshot((thisSession) => {
        if (thisSession.exists) {
          //if session already exist, set as current session
          this.setSession(sessionID);
        } else {
          this.resetSession();
        } 
      });
    }

  }
  

  resetSession() {
    this.setState({ sessionID: null })
    //remove sessionID from address bar
    window.location.href =  window.location.href.split("?")[0];
  }


  async createSession(sessionName) {
    this.props.loadingGIF(true);

    try {
      const newSession = await firebase.firestore().collection("session")
      .add({
        session_name: sessionName,
        users: [],
        users_fetched: []
      });

      console.log("new session ID: " + newSession.id);
      this.setSession(newSession.id);

    } catch (error) {
      console.log("Error creating session: " + error);
    }
    this.props.loadingGIF(false);
  }


  setSession(sessionID) {
    this.setState({ sessionID: sessionID });
  }


  setSessionName(sessionName) {
    this.setState({ sessionName: sessionName });
  }


  handleSessionNameChange(event) {
    console.log("latest sessionName state ==== " + this.state.tempSessionName);
    //used by landing page
    event.preventDefault();
    this.setState({ tempSessionName: event.target.value });
  }


  handleSessionNameSubmit(event) {
    event.preventDefault();
    if (this.state.tempSessionName === "") {
      var date = new Date();
      this.createSession("WatchPartyRescue Session created on " + date.toString());
    } else {
      this.createSession(this.state.tempSessionName);
      this.setSessionName(this.state.tempSessionName);
    }

    // this.setState((state) => ({ sessionName: state.tempSessionName }));
    
  }


  async handleSessionNameUpdate(event) {
    event.preventDefault();
    this.props.loadingGIF(true);

    this.setSessionName(this.state.tempSessionName);
    this.setState({ editMode: false });
    
    try {
       
      const thisSession = await firebase.firestore().collection("session").doc(this.state.sessionID)
      .update({
        session_name: this.state.tempSessionName
      });

      console.log("Session Name successfully updated!");
      
    } catch (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
      this.setState({ editMode: true });
    } finally {
      this.props.loadingGIF(false);
    }

  }


  toggleEditMode() {
    this.setState({ editMode: !this.state.editMode });
  }
  

  EditableSessionNameView() {
    return (
      <React.Fragment>
        <input
          className="session-banner"
          type="text"
          defaultValue={this.state.sessionName}
          onChange={this.handleSessionNameChange}
          /> 
        <br/>
        <button onClick={this.handleSessionNameUpdate}>Save</button>
        <button onClick={this.toggleEditMode}>Discard</button>
      </React.Fragment>
    );
  }


  TextSessionNameView() {
    const sessionRef = firebase.firestore().collection("session").doc(this.state.sessionID);
    sessionRef.onSnapshot((doc) => {
      this.setSessionName(doc.data().session_name);
    })
    return (
      <React.Fragment>
        <span>{this.state.sessionName}</span>
        <br/>
        <button onClick={this.toggleEditMode}>edit</button>
      </React.Fragment>
    );
  }


  CreateSessionView() {
    return (
      <div className="landing">
        <input className="session"
            type="text" 
            placeholder="Event/Session Name"
            onChange={this.handleSessionNameChange}
            />
          <br/>
        <button onClick={this.handleSessionNameSubmit}>♥ Start a new session ♥</button>
      </div>
    );
  }


  ActiveSessionView() {
    return (
      <div className="session-banner">
        <div id="session-banner-content">
          <button id="session-leave" onClick={this.resetSession}>Leave Session</button>
          {this.state.editMode
            ? <this.EditableSessionNameView/> 
            : <this.TextSessionNameView/>}
          <button id="session-share" onClick={() => {
            navigator.clipboard.writeText(window.location.href.split("?")[0] + "?session=" + this.state.sessionID)}}>
            Copy Session Link!
          </button> 
        </div>
      </div>
    );
  }


  render() {
    return (
      <React.Fragment>
        <div className="session">
          {this.state.sessionID != null 
            ? <this.ActiveSessionView/> 
            : <this.CreateSessionView/>}
        </div>
        <div className="app-content">
          {this.state.sessionID !== null 
          && <SignIn
            sessionID = {this.state.sessionID}
            loadingGIF = {this.props.loadingGIF}
          />}
        </div>
      </React.Fragment>
    );
  }
    
}

export default Session;