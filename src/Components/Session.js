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
      sessionRef.get().then((thisSession) => {
        if (thisSession.exists) {
          //if session already exist, access the session
          sessionRef.collection("users")
          .get().then((usersCollection) => {
            this.setState({
              sessionID: sessionID,
              // usersInSessionCount: usersCollection.size
            });
          });
        }
        //reset the URL in the address bar
        navigator.clipboard.writeText(window.location.href.split("?")[0]);         
      });
    }
  }
  

  resetSession() {
    // this.loadingGIF(true);
    //log out of session && sign out of current user
    this.setState({
      sessionID: null,
      user: null,
      usernameMAL: null
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
  }


  handleSessionNameChange(event) {
    console.log("latest sessionName state ==== " + this.state.tempSessionName);
    //used by landing page
    event.preventDefault();
    this.setState({ 
      tempSessionName: event.target.value 
    });
  }


  handleSessionNameSubmit(event) {
    event.preventDefault();

    if (this.state.tempSessionName === "") {
      var date = new Date();
      this.createSession("WatchPartyRescue Session created on " + date.toString());
    } else {
      var currentTempSessionName = this.state.tempSessionName;
      this.createSession(currentTempSessionName);
    }

    this.setState((state) => ({ 
      sessionName: state.tempSessionName 
    }));
  }


  handleSessionNameUpdate(event) {
    event.preventDefault();
    // this.props.loadingGIF(true);

    firebase.firestore().collection("session").doc(this.state.sessionID).update({
      session_name: this.state.tempSessionName
    }).then(() => {
      // this.props.loadingGIF(false);
      console.log("Session Name successfully updated!");
      this.setState(state => ({ 
        editMode: false,
        sessionName: state.tempSessionName
      }));

    }).catch((error) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
  }


  toggleEditMode() {
    this.setState({ 
      editMode: !this.state.editMode 
    });
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
    sessionRef.get().then((doc) => {
      this.setState({ 
        sessionName: doc.data().session_name
      });
    })
    return (
      <React.Fragment>
        {this.state.sessionName}
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
        <button onClick={this.handleSessionNameSubmit}>??? Start a new session ???</button>
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
          <SignIn
            sessionID = {this.state.sessionID}
            // loadingGIF = {this.loadingGIF}
          />
        </div>
      </React.Fragment>
    );
  }
    
}

export default Session;