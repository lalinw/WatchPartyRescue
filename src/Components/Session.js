import React from 'react';
import firebase from '../firebase';
import UserList from "./UserList";

class Session extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempSessionName: ""
    };
    this.handleSessionNameChange = this.handleSessionNameChange.bind(this);
    this.handleSessionNameSubmit = this.handleSessionNameSubmit.bind(this);

    //micro-components
    // this.hasUserTrue = this.hasUserTrue.bind(this);
    // this.hasUserFalse = this.hasUserFalse.bind(this);
    this.hasSessionTrue = this.hasSessionTrue.bind(this);
    this.hasSessionFalse = this.hasSessionFalse.bind(this);
    // this.hasUsernameMAL = this.hasUsernameMAL.bind(this);
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
    if (this.state.tempUser == "") {
      window.alert("Your display name cannot be empty!");
    } else {
      // this.props.setUser(this.state.tempUser);
    }
    event.preventDefault();
    this.setState({ 
      tempSessionName: "" 
    });
  }


  hasSessionTrue() {
    return (
      <div>
        <button onClick={this.props.resetSession}>Leave Session</button>
        <span> </span> Session: {this.props.sessionID} <span> </span>
        <button onClick={() => {
          navigator.clipboard.writeText("http://localhost:3000/" + "?session=" + this.props.sessionID)}}>
          Copy Session Link!
        </button> 
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