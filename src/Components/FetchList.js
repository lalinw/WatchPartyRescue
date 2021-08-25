import { getByTitle } from '@testing-library/react';
import React from 'react';
import firebase from '../firebase';
import ListSummary from './ListSummary';

class FetchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "Irene",
      usernameMAL: "",
      sessionID: "FEHY0ymsqQuX28YISnC7"
    };
    this.getListEndPointMAL = this.getListEndPointMAL.bind(this);
    this.onFetchSubmit = this.onFetchSubmit.bind(this);
    this.fetchHelper = this.fetchHelper.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }
  
  componentDidMount() {

    console.log("componentDidMount ran");
    //save data to firestore  @usersRef.doc("user1").collection("myanimelist")
    // data.anime array
    // field names from data.anime
    // - mal_id   => document name

    //save data to firestore  @summaryMAL.collection("plan_to_watch")
    // data.anime array
    //fields from JSON
    // - mal_id   => document name
    // && add to "common_users" and "occurrences"

    
    //save data to firestore
  }
  
  onFetchSubmit(event) {
    if (this.state.usernameMAL == "") {
      window.alert("Your MAL username cannot be empty!");
      event.preventDefault();
    } else {
      event.preventDefault();
      // still need to handle multiple page case
      var sessionRef = firebase.firestore().collection("session").doc(this.state.sessionID);
      var usersRef = sessionRef.collection("users");
      var summaryMAL = sessionRef.collection("summary").doc("myanimelist");

      //take username as input
      //MAKE API call to Jikan

      console.log("fetching from MAL...");
      // Jikan API endpoint: https://api.jikan.moe/v3/
      //fetch user's watch list 
      var endpointMAL = this.getListEndPointMAL(this.state.usernameMAL, "onhold");
      console.log(this.state.user);
      console.log(this.state.usernameMAL);

      usersRef.doc(this.state.user).get().then((doc) => {
        if (!doc.exists) {
          console.log("doc does not exist");
          usersRef.doc(this.state.user).set({
            myanimelist_username: this.state.usernameMAL,
            myanimelist: []
          });
        }
      }).then(() => {
        //reset the MAL list of IDs 
        usersRef.doc(this.state.user).update({
          myanimelist_username: this.state.usernameMAL,
          myanimelist: []
        });
      }).then(() => {
        console.log("Document successfully reset!");
        var paginationThreshold = 300;
        this.fetchHelper(endpointMAL, 1, paginationThreshold, usersRef.doc(this.state.user), summaryMAL);
      }).catch((error) => {
          console.error("Error updating document: ", error);
      });
    }

  }

  fetchHelper(endpointMAL, page, paginationThreshold, thisUserDoc, summaryMAL) {
    fetch(endpointMAL + page)
      .then(res => res.json())
      .then((data) => {
        console.log("inside fetch statement");

        for (var i = 0; i < data.anime.length; i++) {
          //console.log(data.anime[i]);

          var thisAnime = data.anime[i];
          thisUserDoc.update({
            myanimelist: firebase.firestore.FieldValue.arrayUnion(thisAnime.mal_id)
          });
          
          //add to "all_references"
          // Firestore document ID must be a STRING!
          summaryMAL.collection("all_references").doc(thisAnime.mal_id.toString())
            .set({
              title: thisAnime.title,
              episodes: thisAnime.total_episodes,
              image: thisAnime.image_url,
              link: thisAnime.url
          });

          summaryMAL.collection("plan_to_watch").doc(thisAnime.mal_id.toString())
            .set({
            common_users: firebase.firestore.FieldValue.arrayUnion(this.state.user),
            occurrences: firebase.firestore.FieldValue.increment(1)
          }, { 
            merge: true 
          });
        }
        
        //check for more items after 1st page
        if (data.anime.length == paginationThreshold) {
          this.fetchHelper(endpointMAL, page++, paginationThreshold);
        }
      });
  }
  
  handleTextChange(event) {
    event.preventDefault();
    this.setState({ 
      usernameMAL: event.target.value 
    });
  }

  getListEndPointMAL(usernameMAL, listTypeMAL) {
    return "https://api.jikan.moe/v3/user/" + usernameMAL + "/animelist/" + listTypeMAL + "/";
  }

  render() {
    return (
      <div style={{backgroundColor: "#689F9F"}}>

        <h3>Fetch your list</h3>
        <p><i>(only <b>MyAnimeList: Plan to Watch</b> list is currently supported)</i></p>

        <form>
          <label>MAL username: </label>
          <input 
            type="text" 
            placeholder="your MAL username"
            onChange={this.handleTextChange}
            />
          <button onClick={this.onFetchSubmit}>Fetch Anime List</button>
        </form>
        


      </div>
    );
  }
}

export default FetchList;