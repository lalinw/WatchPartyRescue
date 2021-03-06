import React from 'react';
import firebase from '../firebase';
import ReactDOM from 'react-dom'
//components
import FetchList from "./FetchList";
import ListSummary from "./ListSummary";
import UserList from "./UserList";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      usernameMAL: null,
      tempUser: "",
      existingUsers: []
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);
    this.retrieveExistingUsers = this.retrieveExistingUsers.bind(this);
    this.resetUser = this.resetUser.bind(this);
    this.setUser = this.setUser.bind(this);
    //MAL username methods
    this.setUsernameMAL = this.setUsernameMAL.bind(this);
    this.resetUsernameMAL = this.resetUsernameMAL.bind(this);

    //views
    this.ActiveUserView = this.ActiveUserView.bind(this);
    this.UserSignInView = this.UserSignInView.bind(this);
  }
  

  componentDidMount() {
  }


  handleNameChange(event) {
    event.preventDefault();
    this.setState({ 
      tempUser: event.target.value 
    });
  }


  handleNameSubmit(event) {
    if (this.state.tempUser === "") {
      window.alert("Your display name cannot be empty!");
    } else {
      this.setUser(this.state.tempUser);
    }
    event.preventDefault();
    this.setState({ 
      tempUser: "" 
    });
  }

  async retrieveExistingUsers() {
    const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    const usersRef = sessionRef.collection("users");

    await usersRef.get().then((userDocs) => {
      var localUsers = [];
      userDocs.forEach((theUser) => {
        localUsers.push(theUser.id);
      });
      this.setState({
        existingUsers: localUsers
      })
    });
  }


  resetUser() {
    // this.loadingGIF(true);
    this.setState({
      user: null,
      usernameMAL: null,
    })
  }


  setUser(name) {
    // this.loadingGIF(true);
    this.setState({
      user: name
    })
    const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    const usersRef = sessionRef.collection("users");

    usersRef.doc(name).get().then((thisDoc) => {
      if (!thisDoc.exists) {
        console.log("doc does not exist yet. Creating user...");
        this.retrieveExistingUsers();

        sessionRef.update({
          users_count: firebase.firestore.FieldValue.increment(1)
        });

        usersRef.doc(name).set({
          myanimelist_username: null
        });
      } else {
        this.setState({
          user: name,
          usernameMAL: thisDoc.data().myanimelist_username
        })
      }
    })
    .then(() => {
      console.log("user created / set");
    });
  }


  setUsernameMAL(event, name) {
    // this.loadingGIF(true);
    event.preventDefault();
    this.setState({
      usernameMAL: name
    })
    
    const usersRef = firebase.firestore().collection("session").doc(this.props.sessionID).collection("users");
    usersRef.doc(this.state.user).get()
    .then((doc) => {
      // doc of user already exists if the user is trying to set their MAL username
      console.log("setting user's MAL username as..." + name);
      usersRef.doc(this.state.user).update({
        myanimelist_username: name
      });
    })
    .catch((error) => {
      console.log("Cannot set MAL username: " + error);
      this.resetUsernameMAL();
    });
  }


  resetUsernameMAL() {
    this.setState({
      usernameMAL: null
    })
  }


  ActiveUserView() {
    const parentElement = document.getElementById("banner");
    return ReactDOM.createPortal(
      <div id="profile-card">
        <p><b>{this.state.user}</b> <button onClick={this.resetUser}>Sign Out</button></p>
      </div>, 
      parentElement);
  }


  UserSignInView() {
    this.retrieveExistingUsers();
    return (
      <div className="sign-in">
        <h2>Sign in:</h2>
        <p>Select your name if you have been here before <i>or</i> just enter your display name!</p>
        <form>
          <label>Join session as: </label>
          <select defaultValue={"DEFAULT"} onChange={this.handleNameChange}>
            <option key={"default"} value="DEFAULT">select user</option>
            {this.state.existingUsers.map((eachUser) => {
              return <option key={eachUser} value={eachUser}>{eachUser}</option>
            })}
          </select>
        <span>    or    </span>
          <input className="signin"
            type="text" 
            placeholder="enter your display name"
            onChange={this.handleNameChange}
            />
          <br/>
          <p>
            <button 
              onClick={this.handleNameSubmit} 
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.handleNameSubmit(event)
                }
              }}
              disabled={this.state.tempUser === "" || this.state.tempUser === "DEFAULT"}>Continue</button>
          </p>
        </form>
      </div>
    );
  }


  render() {
    return (
      <React.Fragment>
        {this.props.sessionID !== null 
        && 
          <div className="sign-in">
            {this.state.user !== null 
              ? <this.ActiveUserView/> 
              : <this.UserSignInView/>}
          </div>}
        
        {this.props.sessionID != null 
        && 
          <UserList
            sessionID = {this.props.sessionID}
            user = {this.state.user}
            userList = {this.state.existingUsers}
          />}

        {this.props.sessionID != null 
        && 
        this.state.user !== null 
        && 
          <React.Fragment>
          <FetchList
            sessionID = {this.props.sessionID}
            user = {this.state.user}
            usernameMAL = {this.state.usernameMAL}
            //methods
            setUser = {this.setUser}
            setUsernameMAL = {this.setUsernameMAL}
            resetUser = {this.resetUser}
            resetUsernameMAL = {this.resetUsernameMAL} //might need to move MAL username state down to fetch list
          /> 
          
          <ListSummary
            sessionID = {this.props.sessionID}
            userList = {this.state.existingUsers}
            user = {this.state.user}
          />
        </React.Fragment>}
      </React.Fragment>
    );
  }
    
}

export default SignIn;