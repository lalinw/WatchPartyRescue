import React from 'react';
import firebase from '../firebase';
import UserList from "./UserList";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempUser: "",
      // hasUser: false,
      // sessionID: "",
      // hasSession: false
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);
    // this.resetUser = this.resetUser.bind(this);
    // this.createSession = this.createSession.bind(this);
    

    //micro-components
    this.hasUserTrue = this.hasUserTrue.bind(this);
    this.hasUserFalse = this.hasUserFalse.bind(this);
    this.hasSessionTrue = this.hasSessionTrue.bind(this);
    this.hasSessionFalse = this.hasSessionFalse.bind(this);
    this.hasUsernameMAL = this.hasUsernameMAL.bind(this);
    

    this.removeUser = this.removeUser.bind(this);
  }
  

  componentDidMount() {
    //var sessionRef = firebase.firestore().collection("session").doc(this.state.sessionID);
    //var summaryMAL = sessionRef.collection("summary").doc("myanimelist");

    // this.setState({
    //   sessionID: this.props.sessionID,
    //   hasSession: this.props.hasSession,
    //   user: this.props.user,
    //   hasUser: this.props.hasUser
    // })
  }
  

  handleNameChange(event) {
    event.preventDefault();
    this.setState({ 
      tempUser: event.target.value 
    });
  }


  handleNameSubmit(event) {
    
    if (this.state.tempUser == "") {
      window.alert("Your display name cannot be empty!");
    } else {
      this.props.setUser(this.state.tempUser);
    }
    event.preventDefault();
    this.setState({ 
      tempUser: "" 
    });
  }

  removeUser(event) {
    var thisUser = event.target.id;

    var sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    var summaryMAL = sessionRef.collection("summary").doc("myanimelist");
    var MALplantowatch = summaryMAL.collection("plan_to_watch");
    var usersRef = sessionRef.collection("users");

    //remove user 
    //remove all user's votes
    //remove anime from plan_to_watch if occurrences is 0 after remove user

    // usersRef.doc(thisUser).get().then((doc) => {
    //   if (!doc.exists) {
    //     console.log("doc does not exist");
    //     usersRef.doc(this.state.user).set({
    //       myanimelist_username: "",
    //       myanimelist: [],
    //     });
    //   }
    // });
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
      <div>
        <button onClick={this.props.createSession}>♥ Start a new session ♥</button>
      </div>
    );
  }


  hasUserTrue() {
    return (
      <div>
        <p>Joined as: {this.props.user} <button onClick={this.props.resetUser}>Sign Out</button></p>
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
          <br/>
          <button onClick={this.handleNameSubmit}>Continue</button>
        </form>
      </div>
    );
  }

  hasUsernameMAL() {
    if (this.props.usernameMAL == null) {
      return (
        <p>MyAnimeList account: <button>+ Add your username</button></p>
      );
    } else {
      return (
        <p>MyAnimeList account: {this.props.usernameMAL}</p>
      );
    }
  }


  render() {
    if (this.props.hasSession) {

      if (this.props.hasUser) {
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