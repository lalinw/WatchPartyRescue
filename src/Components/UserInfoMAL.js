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
      this.setState({ usernameMAL: doc.data().myanimelist_username });
    });
  }

  handleTextChange(event) {
    event.preventDefault();
    this.setState({ tempUsernameMAL: event.target.value });
  }


  handleTextSubmit(event) {
    this.props.loadingGIF(true);
    if (this.state.tempUser === "") {
      window.alert("Your display name cannot be empty!");
    } else {
      this.setUser(this.state.tempUsernameMAL);
    }
    event.preventDefault();
  }


  setUsernameMAL(event, name) {
    this.props.loadingGIF(true);
    event.preventDefault();
    this.setState({ usernameMAL: name });
    
    const usersRef = firebase.firestore().collection("session").doc(this.props.sessionID).collection("users");
    usersRef.doc(this.state.user).get()
    .then((doc) => {
      // doc of user already exists if the user is trying to set their MAL username
      console.log("setting user's MAL username as..." + name);
      usersRef.doc(this.state.user).update({
        myanimelist_username: name
      });
      this.setState({ usernameMAL: name });
      this.props.loadingGIF(false);
    })
    .catch((error) => {
      console.log("Cannot set MAL username: " + error);
      this.resetUsernameMAL();
    });
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
              <React.Fragment>
                {this.state.usernameMAL} <button onClick={this.onFetchSubmit}>Fetch latest</button>
              </React.Fragment>
          }
        </p>
        <button onClick={() => {
          this.fetchDataMAL("https://api.jikan.moe/v3/user/pipsqueakma/animelist/plantowatch");
          }}>fetch test</button>
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
          this.props.setUsernameMAL(event, this.state.tempUsernameMAL);
          this.setState({ showFormUsernameMAL: false });
          }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              this.props.setUsernameMAL(event, this.state.tempUsernameMAL);
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

        <FetchList
          sessionID = {this.props.sessionID}
          user = {this.props.user}
          usernameMAL = {this.state.usernameMAL}

          loadingGIF = {this.props.loadingGIF}
        /> 
      </div>
    );
  }
    
}

export default UserInfoMAL;