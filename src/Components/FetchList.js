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

    var MALplantowatch = summaryMAL.collection("plan_to_watch");

    //take username as input
    //MAKE API call to Jikan

    // Jikan API endpoint: https://api.jikan.moe/v3/
    //fetch user's watch list 
    fetch("https://api.jikan.moe/v3/user/zaphriz/animelist/onhold")
      .then(res => res.json())
      .then((data) => {
          console.log(data);
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