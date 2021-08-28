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

    this.removeUser = this.removeUser.bind(this);
  }
  

  componentDidMount() {
    //var sessionRef = firebase.firestore().collection("session").doc(this.state.sessionID);
    //var summaryMAL = sessionRef.collection("summary").doc("myanimelist");

    this.setState({
      sessionID: this.props.sessionID,
      hasSession: this.props.hasSession
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
      
      
      var sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
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

  removeUser(event) {
    var thisUser = event.target.id;
    
    var sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    var usersRef = sessionRef.collection("users");

    usersRef.doc(thisUser).get().then((doc) => {
      if (!doc.exists) {
        console.log("doc does not exist");
        usersRef.doc(this.state.user).set({
          myanimelist_username: "",
          myanimelist: [],
        });
      }
    });
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
        <label>Current Session: {this.props.sessionID}</label>
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
          {this.props.hasSession ? 
            <button onClick={this.handleNameSubmit}>Continue</button>
          : <this.hasSessionFalse/>}
          
        </form>
      </div>
    );
  }


  render() {
    if (this.props.hasSession) {

      if (this.props.hasUser) {
        return (
          <div style={{backgroundColor: "#89556D"}}>
            <this.hasSessionTrue/>
            <this.hasUserTrue/>
          </div>
        );
      } else {
        return (
          <div style={{backgroundColor: "#89B74D"}}>
            <this.hasSessionTrue/>
            <this.hasUserFalse/>
          </div>
        );
      }

    } else {
      return (
        <div style={{backgroundColor: "#C2A9A7"}}>
          <this.hasSessionFalse/>
        </div>
      );
    }
  }
    
}

export default SignIn;