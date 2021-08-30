import { getByTitle } from '@testing-library/react';
import React from 'react';
import firebase from '../firebase';
import ListSummary from './ListSummary';

class FetchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // user: "",
      // hasUser: false,
      tempUsernameMAL: null,
      showFormUsernameMAL: false

      // sessionID: "",
      // hasSession: false,
    };
    this.getListEndPointMAL = this.getListEndPointMAL.bind(this);
    this.onFetchSubmit = this.onFetchSubmit.bind(this);
    this.fetchHelper = this.fetchHelper.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.hasUsernameMAL = this.hasUsernameMAL.bind(this);
    this.formUsernameMAL = this.formUsernameMAL.bind(this);
    this.showFormUsernameMAL = this.showFormUsernameMAL.bind(this);
    this.preFetch = this.preFetch.bind(this);
    
    
  }
  
  componentDidMount() {

    console.log("componentDidMount ran");
    // this.setState({
    //   user: this.props.user,
    //   hasUser: this.props.hasUser,
    //   sessionID: this.props.sessionID,
    //   hasSession: this.props.hasSession
    // })
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
  
  handleTextChange(event) {
    event.preventDefault();
    this.setState({ 
      tempUsernameMAL: event.target.value 
    });
  }

  async onFetchSubmit(event) {
    if (this.props.usernameMAL == null) {
      window.alert("Your MAL username cannot be empty!");
      event.preventDefault();
    } else {
      event.preventDefault();

      console.log("MAL usernam = " + this.state.tempUsernameMAL);
      var sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
      var usersRef = sessionRef.collection("users");
      var summaryMAL = sessionRef.collection("summary").doc("myanimelist");

      //take username as input
      //MAKE API call to Jikan

      console.log("fetching from MAL...");
      // Jikan API endpoint: https://api.jikan.moe/v3/
      //fetch user's watch list 
      var endpointMAL = this.getListEndPointMAL(this.state.tempUsernameMAL, "plantowatch");
      console.log(endpointMAL);

      var prefetch = await this.preFetch();
      var paginationThreshold = 300;
      this.fetchHelper(endpointMAL, 1, paginationThreshold, usersRef.doc(this.props.user), summaryMAL);
            
    }

  }

  async preFetch() {
    console.log("preFetch() is called");
    var sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    var usersRef = sessionRef.collection("users");
    var summaryMAL = sessionRef.collection("summary").doc("myanimelist");

    await summaryMAL.collection("plan_to_watch").where("common_users", "array-contains", this.props.user).get()
      .then((querySnapshot) => {
        querySnapshot.docs.map( (thisDoc) => {
          summaryMAL.collection("plan_to_watch").doc(thisDoc.id).update({
            common_users: firebase.firestore.FieldValue.arrayRemove(this.props.user),
            occurrences: firebase.firestore.FieldValue.increment(-1)
          });
        })
      }).then(() => {
        console.log("summary list has been decremented with user");
      }).catch((error) => {});
    
    // summaryMAL.collection("plan_to_watch").where("occurrences", "<", 1)
    //   .onSnapshot((querySnapshot) => {
    //     querySnapshot.forEach( (thisDoc) => {
    //       summaryMAL.collection("plan_to_watch").doc(thisDoc.id).delete();
    //     });
    //   });
    

  }

  fetchHelper(endpointMAL, page, paginationThreshold, thisUserDoc, summaryMAL) {

    //clear this user's occurrences in summaryMAL
    // summaryMAL.collection("plan_to_watch")
    

    fetch(endpointMAL + page)
      .then(res => res.json())
      .then((data) => {
        console.log("inside fetch statement");

        if (data.anime != undefined) {
          for (var i = 0; i < data.anime.length; i++) {
            // console.log(data.anime[i]);
            var thisAnime = data.anime[i];
            summaryMAL.collection("plan_to_watch").doc(thisAnime.mal_id.toString())
              .set({
              common_users: firebase.firestore.FieldValue.arrayUnion(this.props.user),
              occurrences: firebase.firestore.FieldValue.increment(1),
              title: thisAnime.title,
              episodes: thisAnime.total_episodes,
              image: thisAnime.image_url,
              link: thisAnime.url,
              season: thisAnime.season_name + " " + thisAnime.season_year
            }, { 
              merge: true 
            });
          }
          
          //check for more items after 1st page
          if (data.anime.length == paginationThreshold) {
            this.fetchHelper(endpointMAL, page++, paginationThreshold, thisUserDoc, summaryMAL);
          }
        }
      });
  }

  getListEndPointMAL(usernameMAL, listTypeMAL) {
    return "https://api.jikan.moe/v3/user/" + usernameMAL + "/animelist/" + listTypeMAL + "/";
  }

  hasUsernameMAL() {
    if (this.props.usernameMAL == null) {
      return (
        <p>MyAnimeList account: <button onClick={this.showFormUsernameMAL}>+ Add your username</button>
        </p>
      );
    } else {
      return (
        <p>MyAnimeList account: {this.props.usernameMAL} <button onClick={this.onFetchSubmit}>Fetch latest</button></p>
      );
    }
  }

  formUsernameMAL() {
    return(
      <form>
        <input 
          type="text" 
          placeholder="your MAL username"
          onChange={this.handleTextChange}
          />
        <br/>
        <button onClick={(e) => {
          this.props.setUsernameMAL(e, this.state.tempUsernameMAL);
          this.setState({ 
            showFormUsernameMAL: false
          });
          }}>Save</button>
        {/* <button onClick={this.onFetchSubmit}>Fetch Anime List</button> */}
      </form>
    );
  }

  showFormUsernameMAL() {
    this.setState({ 
      showFormUsernameMAL: true
    });
  }


  render() {
    return (
      <div>

        <h3>Fetch your list</h3>
        <this.hasUsernameMAL/>
        { this.state.showFormUsernameMAL ? <this.formUsernameMAL/> : <React.Fragment/> }
        <p><i>(only <b>MyAnimeList: Plan to Watch</b> list is currently supported)</i></p>

      </div>
    );
  }
}

export default FetchList;