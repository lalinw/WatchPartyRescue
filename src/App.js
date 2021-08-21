//import './App.css';
import React, { Component } from "react";
import FetchList from "./Components/FetchList";
//import firebase from './firebase';

//import logo from './logo.svg';

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }
  
  render() {
    return (
      <div>
      <h2>Hello World!</h2>
      <FetchList />
    </div>



    );
  }
}

export default App;
