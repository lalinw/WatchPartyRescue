import '../App.css';
import React from 'react';
import firebase from '../firebase';


class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }
  
  componentDidMount() {
    var sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    var summaryMAL = sessionRef.collection("summary").doc("myanimelist");

    //display all "plan to watch"
    var MALplantowatch = summaryMAL.collection("plan_to_watch");

  }


 
  render() {
    return;
  }
}

export default UserList;
