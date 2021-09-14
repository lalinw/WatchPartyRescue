import React from 'react';
import firebase from '../firebase';
import ReactDOM from 'react-dom'

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
    this.ActiveUserView = this.ActiveUserView.bind(this);
    this.UserSignInView = this.UserSignInView.bind(this);
    this.existingUsersDropdownFormat = this.existingUsersDropdownFormat.bind(this);
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
      this.props.setUser(this.state.tempUser);
    }
    event.preventDefault();
    this.setState({ 
      tempUser: "" 
    });
  }


  ActiveUserView() {
    const parentElement = document.getElementById("banner");
    return ReactDOM.createPortal(
      <div id="profile-card">
        <p><b>{this.props.user}</b> <button onClick={this.props.resetUser}>Sign Out</button></p>
      </div>, 
      parentElement);
  }

  existingUsersDropdownFormat(eachUser) {
    return 0;
  }

  UserSignInView() {
    const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    const usersRef = sessionRef.collection("users");

    usersRef.onSnapshot((userDocs) => {
      var localUsers = [];
      userDocs.forEach((theUser) => {
        localUsers.push(theUser.id);
      });
      this.setState({
        existingUsers: localUsers
      })
    });
    
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
          <p><button 
            onClick={this.handleNameSubmit} 
            disabled={this.state.tempUser === "" || this.state.tempUser === "DEFAULT"}>Continue</button>
          </p>
        </form>
      </div>
    );
  }


  render() {
    return (
      <React.Fragment>
        {this.props.sessionID !== null && <div className="sign-in">
                                            {this.props.user !== null 
                                              ? <this.ActiveUserView/> 
                                              : <this.UserSignInView/>}
                                          </div>}

      </React.Fragment>
    );
  }
    
}

export default SignIn;