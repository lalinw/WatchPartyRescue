//import './App.css';
import React, { Component } from "react";
import FetchList from "./Components/FetchList";
import ListSummary from "./Components/ListSummary";
import SignIn from "./Components/SignIn";
//import firebase from './firebase';

//import logo from './logo.svg';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: "Irene",
      usernameMAL: "zaphriz",
      sessionID: "wJGmnGUM6JpqiXab2gby"
    };
  }
  
  render() {
    return (
      <div>
      <h2>Hello World!</h2>
      {/* <SignIn/> */}
      <FetchList/>
      {/* <ListSummary/> */}
    </div>



    );
  }
}

export default App;
