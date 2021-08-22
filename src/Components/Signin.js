import React from 'react';
import firebase from '../firebase';

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "Irene",
      sessionID: ""
    };
  }
  
  componentDidMount() {
    var sessionRef = firebase.firestore().collection("session").doc("wJGmnGUM6JpqiXab2gby");
    var summaryMAL = sessionRef.collection("summary").doc("myanimelist");

  }
  

  render() {
    <div>
      <h2>Sign in:</h2>
      <form>
        <label>Enter your display name: </label>
        <input type="text"></input>
        <button onClick={this}>Continue</button>
      </form>

      <h2>♥ Start a new session ♥</h2>
      <button onClick={this}>CREATE SESSION</button>
    </div>
  };
}

export default Signin;