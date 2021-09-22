import React from 'react';
import firebase from '../firebase';
//components
import FetchList from "./FetchList";


class UserInfoMAL extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameMAL: null,
      tempUsernameMAL: null,
      showFormUsernameMAL: false
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTextSubmit = this.handleTextSubmit.bind(this);
    this.setUsernameMAL = this.setUsernameMAL.bind(this);
    this.resetUsernameMAL = this.resetUsernameMAL.bind(this);
    this.showFormUsernameMAL = this.showFormUsernameMAL.bind(this);
    //views
    this.UsernameMALView = this.UsernameMALView.bind(this);
    this.FormUsernameMALView = this.FormUsernameMALView.bind(this);
  }
  

  componentDidMount() {
    const usersRef = firebase.firestore().collection("session").doc(this.props.sessionID).collection("users");
    usersRef.doc(this.props.user).get()
    .then((doc) => {
      var response = doc.data();
      if (response !== undefined && response.myanimelist_username !== null) {
        this.setState({ usernameMAL: response.myanimelist_username });
      }
    });
  }

  handleTextChange(event) {
    event.preventDefault();
    this.setState({ tempUsernameMAL: event.target.value });
  }


  handleTextSubmit(event) {
    event.preventDefault();
    // this.props.loadingGIF(true);
    if (this.state.tempUser === "") {
      window.alert("Your display name cannot be empty!");
    } else {
      this.setUser(this.state.tempUsernameMAL);
    }
    
  }


  async setUsernameMAL(event, name) {
    event.preventDefault();
    this.props.loadingGIF(true);

    const usersRef = firebase.firestore().collection("session").doc(this.props.sessionID).collection("users");
    
    try {
      console.log("setting user's MAL username as..." + name);
      const setUsername = await usersRef.doc(this.props.user).set({
        myanimelist_username: name
      }, { merge: true} );
      this.setState({ usernameMAL: name });
    } catch (error) {
      console.log("Cannot set MAL username: " + error);
      this.resetUsernameMAL();
    }
    this.props.loadingGIF(false);
  }


  resetUsernameMAL() {
    this.setState({ usernameMAL: null });
  }


  UsernameMALView() {
    return (
      <div>
        <p>MyAnimeList
          {
            this.state.usernameMAL == null
            ? 
            <button onClick={this.showFormUsernameMAL}>+ Add your username</button>
            : 
            <span>{this.state.usernameMAL}</span>
          }
        </p>
      </div>
    );
  }


  showFormUsernameMAL() {
    this.setState({ showFormUsernameMAL: true });
  }


  FormUsernameMALView() {
    return(
      <form>
        <input 
          type="text" 
          placeholder="your MAL username"
          onChange={this.handleTextChange}
          />
        <br/>
        <button 
          onClick={(event) => {
          this.setUsernameMAL(event, this.state.tempUsernameMAL);
          this.setState({ showFormUsernameMAL: false });
          }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              this.setUsernameMAL(event, this.state.tempUsernameMAL);
              this.setState({ showFormUsernameMAL: false });
            }
          }}>Save</button>
      </form>
    );
  }


  render() {
    return (
      <div>
        <h2>My linked accounts:</h2>
        <this.UsernameMALView/>
        {this.state.showFormUsernameMAL && <this.FormUsernameMALView/>}

        {this.state.usernameMAL != null 
        &&
        <FetchList
          sessionID = {this.props.sessionID}
          user = {this.props.user}
          usernameMAL = {this.state.usernameMAL}

          loadingGIF = {this.props.loadingGIF}
        />}
      </div>
    );
  }
    
}

export default UserInfoMAL;