import React from 'react';
import firebase from '../firebase';
import ReactDOM from 'react-dom'
//components
import ListSummary from "./ListSummary";
import Manage from './Manage';
import UserList from "./UserList";
import UserInfoMAL from './UserInfoMAL';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      tempUser: "",
      existingUsers: [],
      page: {
        manage: false,
        summary: false,
        menu: false
      }
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleNameSubmit = this.handleNameSubmit.bind(this);
    this.retrieveExistingUsers = this.retrieveExistingUsers.bind(this);
    this.resetUser = this.resetUser.bind(this);
    this.setUser = this.setUser.bind(this);
    //views
    this.ActiveUserView = this.ActiveUserView.bind(this);
    this.UserSignInView = this.UserSignInView.bind(this);
    this.SettingsMenuView = this.SettingsMenuView.bind(this);
  }
  

  componentDidMount() {
    this.retrieveExistingUsers();
  }


  handleNameChange(event) {
    event.preventDefault();
    this.setState({ tempUser: event.target.value });
  }


  handleNameSubmit(event) {
    event.preventDefault();
    // this.props.loadingGIF(true);
    if (this.state.tempUser === "") {
      window.alert("Your display name cannot be empty!");
    } else {
      this.setUser(this.state.tempUser);
    }
  }

  retrieveExistingUsers() {
    const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    // const usersRef = sessionRef.collection("users");

    return sessionRef.onSnapshot((snapshot) => {
      this.setState({ existingUsers: snapshot.data().users });
      // var localUsers = [];
      // snapshot.forEach((theUser) => {
      //   localUsers.push(theUser.id);
      // });
      // this.setState({ existingUsers: localUsers });
    })
    
  }


  resetUser() {
    this.setState({ user: null });
  }


  async setUser(name) {
    this.props.loadingGIF(true);
    this.setState({ user: name });

    var pageStatus = {...this.state.page};
    pageStatus.summary = true;
    this.setState({ page: pageStatus });
    
    const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    //const usersRef = sessionRef.collection("users");
    try {
      
      sessionRef.set({
        users: firebase.firestore.FieldValue.arrayUnion(name)
      }, { merge: true });
      // const createUser = usersRef.doc(name).set({
      //   myanimelist_username: null
      // });
      
      // const incrementUserCount = sessionRef.update({
      //   users_count: firebase.firestore.FieldValue.increment(1)
      // });
      
      // const complete = await Promise.all([createUser, incrementUserCount]);

    } catch (error) {
      this.resetUser();
      console.log(error);
    } finally {
      this.retrieveExistingUsers();
      this.props.loadingGIF(false);
    }

  }

  SettingsMenuView() {
    return (
      <div id="settings-menu">
        <button onClick={() => {
          var pageStatus = {...this.state.page};
          pageStatus.manage = true;
          pageStatus.summary = false;
          this.setState({ page: pageStatus });
          }}>
          Settings
        </button>
        <br/>
        <button onClick={ () => {
          this.resetUser();
          var pageStatus = {...this.state.page};
          pageStatus.menu = false;
          pageStatus.summary = false;
          pageStatus.manage = false;
          this.setState({ page: pageStatus });
          }}>
          Sign Out
        </button>
      </div>
    );
  }

  ActiveUserView() {
    const parentElement = document.getElementById("banner");
    return ReactDOM.createPortal(
      <div id="profile-card">
        <p>
          <b>{this.state.user}</b> 
          <button onClick={ () => {
            //toggle
            var pageStatus = {...this.state.page};
            pageStatus.menu = !this.state.page.menu;
            this.setState({ page: pageStatus });
          }}>
            ↓
          </button>
          {this.state.page.menu && <this.SettingsMenuView/>}
        </p>
      </div>, 
      parentElement);
  }


  UserSignInView() {
    // this.retrieveExistingUsers();
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
        <span>or</span>
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
        <div className="sign-in">
          {this.state.user !== null 
            ? <this.ActiveUserView/> 
            : <this.UserSignInView/>}
        </div>
        
        {this.state.page.manage
        &&
        <Manage
          sessionID = {this.props.sessionID}
          sessionName = {this.props.sessionName}
          user = {this.state.user}
          existingUsers = {this.state.existingUsers}

          loadingGIF = {this.props.loadingGIF}
        />}

        {this.state.page.summary
        &&
        <ListSummary
          sessionID = {this.props.sessionID}
          existingUsers = {this.state.existingUsers}
          user = {this.state.user}
          loadingGIF = {this.props.loadingGIF}
        />}

      </React.Fragment>
    );
  }
    
}

export default SignIn;