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
    // field names from data.anime    @summaryMAL.collection("all_references")
    // - image_url        => image
    // - mal_id           => document name
    // - rating           => rating
    // - title            => title
    // - total_episodes   => episodes
    // - url              => link

    //update "update_time" field with timestamp when new data is added
  }
  

  render() {
    return (
      <div>
        <h2>List Summary below</h2>
      </div>
    );
    
  }
}

export default ListSummary;
