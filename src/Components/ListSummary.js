import React from 'react';
import firebase from '../firebase';

class ListSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  componentDidMount() {
    var sessionRef = firebase.firestore().collection("session").doc("wJGmnGUM6JpqiXab2gby");
    var summaryMAL = sessionRef.collection("summary").doc("myanimelist");

    //display all "plan to watch"
    var MALplantowatch = summaryMAL.collection("plan_to_watch");
    //go through all docs in plantowatch 
    //reference basic data from "all_references"
    
    var MALallreference
    

    //update "update_time" field with timestamp when new data is added
  }
  

  render() {
    <div>
      <h2>Hello World!</h2>
    </div>
  };
}

export default ListSummary;
