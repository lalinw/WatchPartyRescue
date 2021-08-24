import React from 'react';
import firebase from '../firebase';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "Irene",
      sessionID: "wJGmnGUM6JpqiXab2gby"
    };
  }
  
  componentDidMount() {
    var sessionRef = firebase.firestore().collection("session").doc(this.state.sessionID);
    var summaryMAL = sessionRef.collection("summary").doc("myanimelist");

  }
  

  render() {
    return (
      <div>
        <h2>Sign in:</h2>
        <form>
          <label>Display name for this session: </label>
          <input type="text"></input>
          <button >Continue</button>
        </form>
        <br/>
        <p>OR</p>
        <br/>
        <h2>♥ Start a new session ♥</h2>
        <button >CREATE SESSION</button>
      </div>
    );
  };
}

export default SignIn;