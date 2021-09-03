import React from 'react';
import firebase from '../firebase';

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


  hasUserTrue() {
    return (
      <div>
        <p>Joined as: {this.props.user} <button onClick={this.props.resetUser}>Sign Out</button></p>
      </div>
    );
  }


  hasUserFalse() {
    const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    const usersRef = sessionRef.collection("users");

    usersRef.onSnapshot((userDocs) => {
      var localUsers = [];
      localUsers.push(
        <option value="DEFAULT">select user</option>
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
          <select defaultValue={"DEFAULT"} onChange={this.handleNameChange}>
            {this.state.existingUsers}
          </select>
        </form>
        <p>OR</p>
        <form>
          <label>Enter your display name:</label>
          <br/>
          <input class="signin"
            type="text" 
            placeholder="Display name"
            onChange={this.handleNameChange}
            />
          <br/>
          <p><button 
            onClick={this.handleNameSubmit} 
            disabled={this.state.tempUser === ""}
            >Continue</button></p>
        </form>
      </div>
    );
  }



  render() {
    return (
      <React.Fragment>
        {this.props.sessionID !== null && <div class="sign-in">
                                            {this.props.user !== null 
                                              ? <this.hasUserTrue/> 
                                              : <this.hasUserFalse/>}
                                          </div>}

      </React.Fragment>
    );
  }
    
}

export default SignIn;