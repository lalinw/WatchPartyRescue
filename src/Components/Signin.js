import React from 'react';
import firebase from '../firebase';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      hasUser: false,
      sessionID: "",
      hasSession: false
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);
    this.resetUser = this.resetUser.bind(this);
    this.createSession = this.createSession.bind(this);
    this.resetSession = this.resetSession.bind(this);

    //micro-components
    this.hasUserTrue = this.hasUserTrue.bind(this);
    this.hasUserFalse = this.hasUserFalse.bind(this);
    this.hasSessionTrue = this.hasSessionTrue.bind(this);
    this.hasSessionFalse = this.hasSessionFalse.bind(this);
  }
  

  componentDidMount() {
    //var sessionRef = firebase.firestore().collection("session").doc(this.state.sessionID);
    //var summaryMAL = sessionRef.collection("summary").doc("myanimelist");

    //for dev purposes
    this.setState({
      sessionID: "wJGmnGUM6JpqiXab2gby",
      hasSession: true
    })
  }
  

  handleNameChange(event) {
    event.preventDefault();
    this.setState({ 
      user: event.target.value 
    });
  }


  handleNameSubmit(event) {
    if (this.state.user == "") {
      window.alert("Your display name cannot be empty!");
      event.preventDefault();
    } else {
      event.preventDefault();
      this.setState({ 
        hasUser: true 
      });
      
      
      var sessionRef = firebase.firestore().collection("session").doc(this.state.sessionID);
      var usersRef = sessionRef.collection("users");

      usersRef.doc(this.state.user).get().then((doc) => {
        if (!doc.exists) {
          console.log("doc does not exist");
          usersRef.doc(this.state.user).set({
            myanimelist_username: "",
            myanimelist: [],
          });
        }
      });
    }
    console.log(this.state.user + " " + this.state.hasUser);
  }


  resetUser() {
    this.setState({
      user: "",
      hasUser: false
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


  hasSessionTrue() {
    return (
      <div>
        <button onClick={this.resetSession}>Leave Session</button>
        <br/>
        <label>Current Session: {this.state.sessionID}</label>
      </div>

    );
  }


  hasSessionFalse() {
    return (
      <div>
        <button onClick={this.createSession}>♥ Start a new session ♥</button>
      </div>
    );
  }


  hasUserTrue() {
    return (
      <div>
        <button onClick={this.resetUser}>Sign Out</button>
        <p>Joined as: {this.state.user}</p>
      </div>
    );
  }


  hasUserFalse() {
    return (
      <div>
        <h2>Sign in:</h2>
        <form>
          <label>Enter your display name:</label>
          <br/>
          <input 
            type="text" 
            placeholder="Display name"
            onChange={this.handleNameChange}
            />
          {this.state.hasSession? 
            <button onClick={this.handleNameSubmit}>Continue</button>
          : <this.hasSessionFalse/>}
          
        </form>
      </div>
    );
  }


  render() {
    if (this.state.hasSession) {

      if (this.state.hasUser) {
        return (
          <div>
            <this.hasSessionTrue/>
            <this.hasUserTrue/>
          </div>
        );
      } else {
        return (
          <div>
            <this.hasSessionTrue/>
            <this.hasUserFalse/>
          </div>
        );
      }

    } else {
      return (
        <div>
          <this.hasSessionFalse/>
        </div>
      );
    }
  }
    
}

export default SignIn;