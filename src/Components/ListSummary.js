import '../App.css';
import React from 'react';
import firebase from '../firebase';

class ListSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listSummaryItems: [],
      sessionID: "",
      hasSession: false
    };
    this.constructItemTier = this.constructItemTier.bind(this);
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
    //go through all docs in plantowatch 
    //reference basic data from "all_references"
    
    var MALallreference = summaryMAL.collection("all_references");
    // field names from data.anime    @summaryMAL.collection("all_references")
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

  constructItemTier(userCount) {
    var sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    var summaryMAL = sessionRef.collection("summary").doc("myanimelist");
    var MALplantowatch = summaryMAL.collection("plan_to_watch");
    var MALallreference = summaryMAL.collection("all_references");
    
    MALplantowatch.where('occurrences', "==", userCount).get()
      .then((querySnapshot) => {
        var thisItemTier = [];
        querySnapshot.forEach((plantowatchDoc) => {

          MALallreference.doc(plantowatchDoc.id).get().then((doc) => {
            console.log(doc.data().image);
            
            thisItemTier.push(
              // <img src={doc.data().image}/>
              <div class="poster-image">
                <img src={doc.data().image}/>
                <div class="overlay-dim">
                    <h2><span>{doc.data().title}</span></h2>
                    <p>{plantowatchDoc.data().common_users.join(", ")}</p>
                    <h1>{plantowatchDoc.data().occurrences}</h1>
                </div>
              </div>
            );
          }).then(() => {
            this.setState({
              listSummaryItems: thisItemTier
            });
          });
        });
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
