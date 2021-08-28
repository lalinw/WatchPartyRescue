import '../App.css';
import React from 'react';
import firebase from '../firebase';

class ListSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listSummaryItems: [],
      tempTier: [],
      sessionID: "",
      hasSession: false
    };
    this.constructItemTier = this.constructItemTier.bind(this);
  }
  
  componentDidMount() {

    this.setState({
      sessionID: this.props.sessionID,
      hasSession: this.props.hasSession
    })

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
    console.log("ListSummary below:");
    
    for (var i = this.props.usersInSessionCount; i > 0; i--) {
      this.constructItemTier(i);
    }
    
    //update "update_time" field with timestamp when new data is added
    //date_updated: firebase.firestore.FieldValue.serverTimestamp()
  }

  async constructItemTier(usersCount) {
    var sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    var summaryMAL = sessionRef.collection("summary").doc("myanimelist");
    var MALplantowatch = summaryMAL.collection("plan_to_watch");
    var MALallreference = summaryMAL.collection("all_references");
    
    //clear tempTier state
    this.setState({
      tempTier: []
    });

    console.log("users => " + usersCount);
    var thisTier = await MALplantowatch.where('occurrences', "==", usersCount).get()
      .then((querySnapshot) => {
        var thisItemTier = [];
        thisItemTier.push(
          <div class="item-tier">
            <p>Items with {usersCount} votes</p>
          </div>
        );

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
      console.log("listSummaryItems -> " + this.state.listSummaryItems);
      console.log("thisTier finished running with no errors");
  
    }).catch((error) => {});
    
  }
  
  // <div class="poster-image">
  //   <img src={doc.data().image}>
  //   <div class="overlay-dim">
  //       <h3><span>{doc.data().title}</span></h3>
  //       <p>[votes]</p>
  //   </div>
  // </div>

  render() {
    return (
      <div style={{backgroundColor: "#D53878"}}>
        <h3>List Summary below</h3>
        <div>
          {this.state.listSummaryItems}
        </div>
      </div>
    );
    
  }
}

export default ListSummary;
