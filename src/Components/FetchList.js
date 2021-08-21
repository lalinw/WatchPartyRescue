import { getByTitle } from '@testing-library/react';
import React from 'react';
import firebase from '../firebase';

class FetchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "Irene",
      usernameMAL: "zaphriz"
    };
    this.getListEndPointMAL = this.getListEndPointMAL.bind(this)
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
    var endpointMAL = this.getListEndPointMAL(this.state.usernameMAL, "onhold");
    //console.log(endpointMAL);
    fetch(endpointMAL)
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        
        //clear the MAL list of IDs 
        usersRef.doc("user1").update({
          myanimelist: firebase.firestore.FieldValue.delete()
        })

        for (var i = 0; i < data.anime.length; i++) {
          //console.log(data.anime[0]);

          var thisAnime = data.anime[i];
          usersRef.doc("user1").update({
            myanimelist: firebase.firestore.FieldValue.arrayUnion(thisAnime.mal_id)
          })
          
          //add to "all_references"
          //should add check for exising document
          // Firestore document ID must be a STRING!
          summaryMAL.collection("all_references").doc(thisAnime.mal_id.toString())
            .set({
              title: thisAnime.title,
              episodes: thisAnime.total_episodes,
              image: thisAnime.image_url,
              link: thisAnime.url
          });
          

          // summaryMAL.collection("plan_to_watch").doc(thisAnime.mal_id.toString())
          //   .get()
          //   .then((doc) => {
          //     console.log("updating plan_to_watch " + doc.exists);

          //     if (doc.exists) {
          //       summaryMAL.collection("plan_to_watch").doc(thisAnime.mal_id.toString()).update({
          //         common_users: firebase.firestore.FieldValue.arrayUnion(this.state.user),
          //         occurrences: firebase.firestore.FieldValue.increment(1)
          //       });
          //     } else {
          //       console.log("inside the else");
          //       summaryMAL.collection("plan_to_watch").doc(thisAnime.mal_id.toString()).set({
          //         common_users: [this.state.user],
          //         occurrences: 1
          //       }).then(() => {console.log("set completed")});
          //     }
             
          // });
        }

        

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
          });
        }
      )
    
    //save data to firestore
  }
  
  getListEndPointMAL(usernameMAL, listTypeMAL) {
    return "https://api.jikan.moe/v3/user/" + usernameMAL + "/animelist/" + listTypeMAL;
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