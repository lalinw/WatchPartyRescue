import React from 'react';
import firebase from '../firebase';
import UserList from "./UserList";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempUser: "",
      existingUsers: []
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);

    //micro-components
    this.hasUserTrue = this.hasUserTrue.bind(this);
    this.hasUserFalse = this.hasUserFalse.bind(this);
    this.hasSessionTrue = this.hasSessionTrue.bind(this);
    this.hasSessionFalse = this.hasSessionFalse.bind(this);
    this.hasUsernameMAL = this.hasUsernameMAL.bind(this);
  }
  

  componentDidMount() {
    //var sessionRef = firebase.firestore().collection("session").doc(this.state.sessionID);
    //var summaryMAL = sessionRef.collection("summary").doc("myanimelist");
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
    var sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    var usersRef = sessionRef.collection("users");

    usersRef.onSnapshot((userDocs) => {
      var localUsers = [];
      localUsers.push(
        <option selected value="">select user</option>
      );
      userDocs.forEach((theUser) => {
        localUsers.push(
          <option value={theUser.id}>{theUser.id}</option>
        );
      });
      this.setState({
        existingUsers: localUsers
      })
    });
    
    return (
      <div>
        <h2>Sign in:</h2>
        <form>
          <label>Log in as: </label>
          <select value={this.props.user} onChange={this.handleNameChange}>
            {this.state.existingUsers}
          </select>
        </form>
        <p>OR</p>
        <form>
          <label>Enter your display name:</label>
          <br/>
          <input 
            type="text" 
            placeholder="Display name"
            onChange={this.handleNameChange}
            />
          <br/>
          <p><button 
            onClick={this.handleNameSubmit} 
            disabled={this.state.tempUser == ""}
            >Continue</button></p>
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
    return (
      <React.Fragment>

        <div class="session">
          {this.props.sessionID != null ? 
            <this.hasSessionTrue/> :
            <this.hasSessionFalse/> }
        </div>

        {this.props.sessionID != null ? 
          <div class="sign-in">
            {this.props.user != null ? 
              <this.hasUserTrue/> : 
              <this.hasUserFalse/>}</div> :
          <React.Fragment/> }

      </React.Fragment>
    );
  }
    
}

export default SignIn;