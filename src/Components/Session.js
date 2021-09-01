import React from 'react';
import firebase from '../firebase';
import UserList from "./UserList";

class Session extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempSessionName: "",
      sessionName: "",
      editMode: false
    };
    this.handleSessionNameChange = this.handleSessionNameChange.bind(this);
    this.handleSessionNameSubmit = this.handleSessionNameSubmit.bind(this);

    this.handleSessionNameUpdate = this.handleSessionNameUpdate.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.editableSessionNameView = this.editableSessionNameView.bind(this);
    this.textSessionNameView = this.textSessionNameView.bind(this);

    //micro-components
    this.hasSessionTrue = this.hasSessionTrue.bind(this);
    this.hasSessionFalse = this.hasSessionFalse.bind(this);
  }
  

  componentDidMount() {
    //var sessionRef = firebase.firestore().collection("session").doc(this.state.sessionID);
    //var summaryMAL = sessionRef.collection("summary").doc("myanimelist");
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
      this.props.createSession("WatchPartyRescue Session created on " + firebase.firestore.FieldValue.serverTimestamp());
    } else {
      this.props.createSession(this.state.tempSessionName);
    }

    this.setState({ 
      sessionName: this.state.tempSessionName 
    });
  }

  handleSessionNameUpdate(event) {
    event.preventDefault();
    const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    this.setState({ 
      editMode: false,
      sessionName: this.state.tempSessionName
    });
    console.log("handle session name update");
    sessionRef.update({
      session_name: this.state.sessionName
    }).then(() => {
      console.log("Session Name successfully updated!");
    }).catch((error) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
    console.log("handle session name update END");
  }


  hasSessionTrue() {
    //retrieve session name from firestore
    const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    sessionRef.get().then((doc) => {
      this.setState({ 
        sessionName: doc.data().session_name 
      });
    });
    return (
      <div class="session-banner">
        <div id="session-banner-content">
          <button id="session-leave" onClick={this.props.resetSession}>Leave Session</button>
          {this.state.editMode ? <this.editableSessionNameView/> : <this.textSessionNameView/>}
          <button id="session-share" onClick={() => {
            navigator.clipboard.writeText(window.location.href.split("?")[0] + "?session=" + this.props.sessionID)}}>
            Copy Session Link!
          </button> 
        </div>
      </div>
    );
  }

  toggleEditMode() {
    this.setState({ 
      editMode: !this.state.editMode 
    });
  }
  
  editableSessionNameView() {
    return (
      <React.Fragment>
        <input
          type="text"
          defaultValue={this.state.sessionName}
          onChange={this.handleSessionNameChange}
          /> 
        <button onClick={this.handleSessionNameUpdate}>Save</button>
        <button onClick={this.toggleEditMode}>Discard</button>
      </React.Fragment>
    );
  }

  textSessionNameView() {
    const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    sessionRef.get().then((doc) => {
      this.setState({ 
        sessionName: doc.data().session_name
      });
    })

    return (
      <React.Fragment>
        <p>{this.state.sessionName}<button onClick={this.toggleEditMode}>edit</button></p>
      </React.Fragment>
    );
  }



  hasSessionFalse() {
    return (
      <div class="landing">
        <input class="session"
            type="text" 
            placeholder="Event/Session Name"
            onChange={this.handleSessionNameChange}
            />
          <br/>
        <button onClick={this.handleSessionNameSubmit}>♥ Start a new session ♥</button>
      </div>
    );
  }


  render() {
    return (
      <React.Fragment>

        <div class="session">
          {this.props.sessionID != null ? 
            <this.hasSessionTrue/> :
            <this.hasSessionFalse/> }
        </div>

      </React.Fragment>
    );
  }
    
}

export default Session;