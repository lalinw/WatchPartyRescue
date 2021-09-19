import React from 'react';
import firebase from '../firebase';

class FetchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempUsernameMAL: null,
      showFormUsernameMAL: false
    };
    //fetch methods
    this.getListEndPointMAL = this.getListEndPointMAL.bind(this);
    this.onFetchSubmit = this.onFetchSubmit.bind(this);
    this.fetchHelper = this.fetchHelper.bind(this);
    this.preFetch = this.preFetch.bind(this);

    // this.fetchDataMAL = this.fetchDataMAL.bind(this);
  }
  
  componentDidMount() {
  }


  async onFetchSubmit(event) {
    if (this.props.usernameMAL == null) {
      window.alert("Cannot fetch your MyAnimeList without your account name. \nAdd your MyAnimeList username!");
      event.preventDefault();
    } else {
      event.preventDefault();
      this.props.loadingGIF(true);

      console.log("MAL usernam = " + this.props.usernameMAL);
      const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
      const usersRef = sessionRef.collection("users");
      const summaryMAL = sessionRef.collection("summary").doc("myanimelist");

      //take username as input
      console.log("fetching from MAL...");
      // Jikan API endpoint: https://api.jikan.moe/v3/
      //fetch user's watch list 
      var endpointMAL = this.getListEndPointMAL(this.props.usernameMAL, "plantowatch");
      console.log(endpointMAL);

      await this.preFetch();
      const paginationThreshold = 300;
      this.fetchHelper(endpointMAL, 1, paginationThreshold, usersRef.doc(this.props.user), summaryMAL);
    }
  }


  async preFetch() {
    console.log("preFetch() is called");
    const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    const summaryMAL = sessionRef.collection("summary").doc("myanimelist");

    await summaryMAL.collection("plan_to_watch")
                    .where("common_users", "array-contains", this.props.user)
    .get().then((querySnapshot) => {
      querySnapshot.docs.map( (thisDoc) => {
        return summaryMAL.collection("plan_to_watch").doc(thisDoc.id).update({
          common_users: firebase.firestore.FieldValue.arrayRemove(this.props.user),
          occurrences: firebase.firestore.FieldValue.increment(-1)
        });
      })
    })
    .then(() => {
      console.log("summary list of user is reset");
    }).catch((error) => {});
  }


  async fetchHelper(endpointMAL, page, paginationThreshold, thisUserDoc, summaryMAL) {
    console.log("making API call...");

    var data;
    fetch(endpointMAL + page)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        this.props.loadingGIF(false);
        throw Error(response.statusText);
      }
    })
    .then(resJSON => data = resJSON.anime)
    .then(() => {
      console.log(data);

      if (data !== undefined) {
        for (var i = 0; i < data.length; i++) {
          // console.log(data[i].title);
          var thisAnime = data[i];
          var released; 
          if (thisAnime.season_year == null) {
            if (thisAnime.airing_status <= 2) {
              released = thisAnime.start_date.substring(0,4);
            } else {
              released = "TBA";
            }
          } else {
            released = thisAnime.season_name + " " + thisAnime.season_year;
          }
          
          summaryMAL.collection("plan_to_watch").doc(thisAnime.mal_id.toString())
          .set({
            common_users: firebase.firestore.FieldValue.arrayUnion(this.props.user),
            occurrences: firebase.firestore.FieldValue.increment(1),
            title: thisAnime.title,
            episodes: thisAnime.total_episodes,
            image: thisAnime.image_url,
            link: thisAnime.url,
            season: released
          }, { 
            merge: true 
          })
          .then(() => {
            console.log("anime written to firestore");
          });
        }
        
        //check for more items after 1st page
        if (data.length === paginationThreshold) {
          this.fetchHelper(endpointMAL, page++, paginationThreshold, thisUserDoc, summaryMAL);
        } else {
          
          const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
          const usersRef = sessionRef.collection("users");
          
          usersRef.doc(this.props.user)
          .set({
            last_fetched: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true })
          .then(() => {
            console.log("last_fetched updated");
          });
          
          summaryMAL
          .set({
            latest_fetch: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true })
          .then(() => {
            console.log("last_fetched updated");
          });

        }
      }
      this.props.loadingGIF(false);
    });
  }

  getListEndPointMAL(usernameMAL, listTypeMAL) {
    return "https://api.jikan.moe/v3/user/" + usernameMAL + "/animelist/" + listTypeMAL + "/";
  }


  async fetchDataMAL(endpoint) {
    this.props.loadingGIF(true);
  }

  
  render() {
    return (
      <div>

        <h3>Fetch your list</h3>
        <this.UsernameMALView/>
        {this.state.showFormUsernameMAL && <this.FormUsernameMALView/>}

      </div>
    );
  }
}

export default FetchList;