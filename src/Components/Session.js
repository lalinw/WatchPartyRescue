import React from 'react';
import firebase from '../firebase';

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

    //component views
    this.EditableSessionNameView = this.EditableSessionNameView.bind(this);
    this.TextSessionNameView = this.TextSessionNameView.bind(this);
    this.ActiveSessionView = this.ActiveSessionView.bind(this);
    this.CreateSessionView = this.CreateSessionView.bind(this);
  }
  

  componentDidMount() {
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
      this.props.createSession("WatchPartyRescue Session created on " + date.toString());
    } else {
      var currentTempSessionName = this.state.tempSessionName;
      this.props.createSession(currentTempSessionName);
    }

    this.setState((state) => ({ 
      sessionName: state.tempSessionName 
    }));
  }

  handleSessionNameUpdate(event) {
    event.preventDefault();
    this.setState(state => ({ 
      editMode: false,
      sessionName: state.tempSessionName
    }));

    // this.props.loadingGIF(true);

    firebase.firestore().collection("session").doc(this.props.sessionID).update({
      session_name: this.state.tempSessionName
    }).then(() => {
      // this.props.loadingGIF(false);
      console.log("Session Name successfully updated!");

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
    const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
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
        <button onClick={this.handleSessionNameSubmit}>♥ Start a new session ♥</button>
      </div>
    );
  }

  ActiveSessionView() {
    return (
      <div className="session-banner">
        <div id="session-banner-content">
          <button id="session-leave" onClick={this.props.resetSession}>Leave Session</button>
          {this.state.editMode
            ? <this.EditableSessionNameView/> 
            : <this.TextSessionNameView/>}
          <button id="session-share" onClick={() => {
            navigator.clipboard.writeText(window.location.href.split("?")[0] + "?session=" + this.props.sessionID)}}>
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
          {this.props.sessionID != null 
            ? <this.ActiveSessionView/> 
            : <this.CreateSessionView/>}
        </div>
      </React.Fragment>
    );
  }
    
}

export default Session;