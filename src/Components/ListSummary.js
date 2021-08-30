import '../App.css';
import React from 'react';
import firebase from '../firebase';
import loading from './../loading_doggo.gif';

class ListSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listSummaryItems: null,
      tempTier: [],
      isLoading: false
    };
    this.constructItemTier = this.constructItemTier.bind(this);
    this.showLoadingGIF = this.showLoadingGIF.bind(this);
    this.updateSummaryList = this.updateSummaryList.bind(this);
  }
  
  componentDidMount() {

    // this.setState({
    //   sessionID: this.props.sessionID,
    //   hasSession: this.props.hasSession
    // })

    var sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    var summaryMAL = sessionRef.collection("summary").doc("myanimelist");

    //display all "plan to watch"
    var MALplantowatch = summaryMAL.collection("plan_to_watch");
    // - image_url        => image
    // - mal_id           => document name
    // - rating           => rating
    // - title            => title
    // - total_episodes   => episodes
    // - url              => link

    //update "update_time" field with timestamp when new data is added
    //date_updated: firebase.firestore.FieldValue.serverTimestamp()
  }

  updateSummaryList() {

    console.log("ListSummary below:");
    
    //list all items with 2+ common users
    for (var i = this.props.usersInSessionCount; i > 1; i--) {
      this.constructItemTier(i);
    }

  }

  async constructItemTier(usersCount) {
    console.log("item tier called");
    var sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    var summaryMAL = sessionRef.collection("summary").doc("myanimelist");
    var MALplantowatch = summaryMAL.collection("plan_to_watch");
    // var MALallreference = summaryMAL.collection("all_references");
    
    //clear tempTier state
    this.setState({
      tempTier: []
    });
    
    console.log("users => " + usersCount);
    await MALplantowatch.where('occurrences', "==", usersCount).get()
      .then((querySnapshot) => {
        var thisItemTier = [];
        thisItemTier.push(
          <div class="item-tier">
            <p>Items with {usersCount} votes</p>
          </div>
        );
        console.log(thisItemTier);
        querySnapshot.docs.map( (plantowatchDoc)=> {
            thisItemTier.push(
              // <img src={doc.data().image}/>
              <div class="poster-image">
                <img src={plantowatchDoc.data().image}/>
                <div class="overlay-dim">
                    <h2><span>{plantowatchDoc.data().title}</span></h2>
                    <p><span class="field-name">Episodes:</span> 
                    <br/>{plantowatchDoc.data().episodes}</p>
                    <p><span class="field-name">Released:</span> 
                    <br/>{plantowatchDoc.data().season}</p>
                    <p>({plantowatchDoc.data().common_users.join(", ")})</p>
                    {/* <h1>{plantowatchDoc.data().occurrences}</h1> */}
                    <a href={plantowatchDoc.data().link}><button>see details on MyAnimeList</button></a>
                    {/* <div class="item-info">
                      <img src={plantowatchDoc.data().image}/>
                      <p><b>Title:</b> {plantowatchDoc.data().title}</p>
                      <p><b>Episodes:</b> {plantowatchDoc.data().episodes}</p>
                      <p><b>Released:</b> {plantowatchDoc.data().season}</p>
                      <a href={plantowatchDoc.data().link}>see details on MyAnimeList</a>
                    </div>  */}
                </div>
              </div>
            );
            this.setState({
              tempTier: thisItemTier
            });
            console.log("temp tier -> " + this.state.tempTier);
        });

    }).then(() => {
      this.setState({
        listSummaryItems: this.state.listSummaryItems.concat(this.state.tempTier)
      });
      //console.log("listSummaryItems -> " + this.state.listSummaryItems);
      console.log("thisTier finished running with no errors");
  
    }).catch((error) => {});
    
  }

  showLoadingGIF() {
    return (
      <img src={loading}/>
    );
  }
  
  // <div class="poster-image">
  //   <img src={doc.data().image}>
  //   <div class="overlay-dim">
  //       <h3><span>{doc.data().title}</span></h3>
  //       <p>[votes]</p>
  //   </div>
  // </div>

  render() {
    console.log(this.state.listSummaryItems);
    if (this.state.listSummaryItems == null) {
      return (
        <div>
          <button onClick={this.updateSummaryList}>Find titles everyone has in common!</button>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Titles you have in common!</h3>
          <div>
            {this.state.listSummaryItems}
          </div>
        </div>
      );
    }
    
    
  }
}

export default ListSummary;
