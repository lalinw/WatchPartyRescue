import React from 'react';
import firebase from '../firebase';
import UserList from "./UserList";

class Session extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionName: ""
    };
    this.handleSessionNameChange = this.handleSessionNameChange.bind(this);
    this.handleSessionNameSubmit = this.handleSessionNameSubmit.bind(this);

    //micro-components
    this.hasSessionTrue = this.hasSessionTrue.bind(this);
    this.hasSessionFalse = this.hasSessionFalse.bind(this);
  }
  

  componentDidMount() {
    //var sessionRef = firebase.firestore().collection("session").doc(this.state.sessionID);
    //var summaryMAL = sessionRef.collection("summary").doc("myanimelist");
  }
  

  handleSessionNameChange(event) {
    event.preventDefault();
    this.setState({ 
      tempSessionName: event.target.value 
    });
  }


  handleSessionNameSubmit(event) {
    if (this.state.sessionName === "") {
      window.alert("Your display name cannot be empty!");
    } else {
      // this.props.setUser(this.state.tempUser);
    }
    event.preventDefault();
    this.setState({ 
      sessionName: "" 
    });
  }



  hasSessionTrue() {
    //retrieve session name from firestore
    return (
      <div class="session-banner">
        <div id="session-banner-content">
          <button id="session-leave" onClick={this.props.resetSession}>Leave Session</button>
          <span> </span> Session: {this.props.sessionID} <span> </span>
          <button id="session-share" onClick={() => {
            navigator.clipboard.writeText(window.location.href.split("?")[0] + "?session=" + this.props.sessionID)}}>
            Copy Session Link!
          </button> 
        </div>
      </div>
    );
  }


  hasSessionFalse() {
    return (
      <div class="landing">
        <input class="session"
            type="text" 
            placeholder="Event/Session Name"
            onChange={this.handleNameChange}
            />
          <br/>
        <button onClick={this.props.createSession}>♥ Start a new session ♥</button>
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