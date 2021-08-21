import { getByTitle } from '@testing-library/react';
import React from 'react';
import firebase from '../firebase';

class FetchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  componentDidMount() {
    var sessionRef = firebase.firestore().collection("session").doc("wJGmnGUM6JpqiXab2gby");
    var summaryMAL = sessionRef.collection("summary").doc("myanimelist");
    var usersRef = sessionRef.collection("users");

    var MALplantowatch = summaryMAL.collection("plan_to_watch");

    //take username as input
    //MAKE API call to Jikan

    console.log("fetching from MAL...");
    // Jikan API endpoint: https://api.jikan.moe/v3/
    //fetch user's watch list 
    fetch("https://api.jikan.moe/v3/user/zaphriz/animelist/onhold")
      .then(res => res.json())
      .then((data) => {
        console.log(data);

        //save data to firestore  @usersRef.doc("user1").collection("myanimelist")
        // data.anime array
        // field names from data.anime
        // - mal_id   => document name

        //save data to firestore  @summaryMAL.collection("plan_to_watch")
        // data.anime array
        //fields from JSON
        // - mal_id   => document name
        // && add to "common_users" and "occurrences"

        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
    
    //save data to firestore
  }
  

  render() {
    return (
      <div>
        <h2>FetchList.js is mounted!</h2>
      </div>
    );
  }
}

export default FetchList;