import React from 'react';
import firebase from '../firebase';
// import ListSummary from './ListSummary';

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
    //MAL username methods
    this.handleTextChange = this.handleTextChange.bind(this);
    this.showFormUsernameMAL = this.showFormUsernameMAL.bind(this);

    //component views
    this.UsernameMALView = this.UsernameMALView.bind(this);
    this.FormUsernameMALView = this.FormUsernameMALView.bind(this);
  }
  
  componentDidMount() {
  }

  handleTextChange(event) {
    event.preventDefault();
    this.setState({ 
      tempUsernameMAL: event.target.value 
    });
  }

  async onFetchSubmit(event) {
    if (this.props.usernameMAL == null) {
      window.alert("Cannot fetch your MyAnimeList without your account name. \nAdd your MyAnimeList username!");
      event.preventDefault();
    } else {
      event.preventDefault();
      // this.props.loadingGIF(true);

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
    }).then(() => {
      console.log("summary list of user is reset");
    }).catch((error) => {});
  }

  fetchHelper(endpointMAL, page, paginationThreshold, thisUserDoc, summaryMAL) {
    console.log("making API call...");
    fetch(endpointMAL + page)
    .then(res => res.json())
    .then((data) => {
      if (data.anime !== undefined) {
        for (var i = 0; i < data.anime.length; i++) {
          // console.log(data.anime[i]);
          var thisAnime = data.anime[i];
          var released = thisAnime.season_year;
          if (released == null) {
            released = "unknown";
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
          });
        }
        
        //check for more items after 1st page
        if (data.anime.length === paginationThreshold) {
          this.fetchHelper(endpointMAL, page++, paginationThreshold, thisUserDoc, summaryMAL);
        }
      }
    })
    .then(() => {
      console.log("API call successful.");
      // this.props.loadingGIF(false);
    })
    .catch((error) => {
      console.log("API Unavailable: " + error);
    });
    
  }

  getListEndPointMAL(usernameMAL, listTypeMAL) {
    return "https://api.jikan.moe/v3/user/" + usernameMAL + "/animelist/" + listTypeMAL + "/";
  }


  UsernameMALView() {
    if (this.props.usernameMAL == null) {
      return (
        <p>
          MyAnimeList account: 
          <button onClick={this.showFormUsernameMAL}>+ Add your username</button>
        </p>
      );
    } else {
      return (
        <p>MyAnimeList account: {this.props.usernameMAL} <button onClick={this.onFetchSubmit}>Fetch latest</button></p>
      );
    }
  }

  FormUsernameMALView() {
    return(
      <form>
        <input 
          type="text" 
          placeholder="your MAL username"
          onChange={this.handleTextChange}
          />
        <br/>
        <button onClick={(event) => {
          this.props.setUsernameMAL(event, this.state.tempUsernameMAL);
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
        <this.UsernameMALView/>
        {this.state.showFormUsernameMAL && <this.FormUsernameMALView/>}

      </div>
    );
  }
}

export default FetchList;