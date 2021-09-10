import '../App.css';
import React from 'react';
import firebase from '../firebase';


class ListSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listSummaryItems: [],
      tempTier: [],
    };
    this.constructItemTier = this.constructItemTier.bind(this);
    this.updateSummaryList = this.updateSummaryList.bind(this);
    this.retrieveAllItems = this.retrieveAllItems.bind(this);
  }
  
  componentDidMount() {
    //this.updateSummaryList();
  }

  componentDidUpdate() {
    // this.props.loadingGIF(false);
  }

  updateSummaryList() {
    //reset 
    this.setState({
      listSummaryItems: []
    });
    // this.props.loadingGIF(true);
    console.log("ListSummary below:");
    //list all items with 2+ common users
    for (var i = this.props.usersInSessionCount; i > 1; i--) {
      this.constructItemTier(i);
    }
  }

  retrieveAllItems() {
    console.log("retrieveAllItems started...");
    //retrieve all items and save to state
    //array of objects 
    const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    const summaryMAL = sessionRef.collection("summary").doc("myanimelist");
    const MALplantowatch = summaryMAL.collection("plan_to_watch");

    MALplantowatch.get()
    .then((allItems) => {
      var localAllItems = [];
      allItems.docs.map((plantowatchDoc) => {
        var item = 
        {
          img:          plantowatchDoc.data().image,
          title:        plantowatchDoc.data().title,
          eps:          plantowatchDoc.data().episodes,
          season:       plantowatchDoc.data().season,
          common_users: plantowatchDoc.data().common_users.join(", "),
          users_count:  plantowatchDoc.data().common_users.length,
          link:         plantowatchDoc.data().link
        };

        console.log(item);
        console.log(item.title);
        localAllItems.push(item);
        //localAllItems is valid array of objects
        console.log(localAllItems);
        //this things gives errors
        // this.setState(state => ({
        //   listSummaryItems: [{localAllItems}]
        // }));
        
        
      });
    })
    .then(() => {
      console.log("all items retrieved!");
      console.log("list summary items (all) = " + this.state.listSummaryItems);
    });
  }

  async constructItemTier(usersCount) {
    console.log("item tier called");
    const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    const summaryMAL = sessionRef.collection("summary").doc("myanimelist");
    const MALplantowatch = summaryMAL.collection("plan_to_watch");
    
    //clear tempTier state
    this.setState({
      tempTier: []
    });
    
    console.log("users => " + usersCount);
    await MALplantowatch.where('occurrences', "==", usersCount).get()
    .then((querySnapshot) => {
      var thisItemTier = [];
      thisItemTier.push(
        <div className="item-tier">
          <p>Items with {usersCount} votes</p>
        </div>
      );
      console.log(thisItemTier);
      querySnapshot.docs.map( (plantowatchDoc)=> {
          thisItemTier.push(
            <div className="poster-image">
              <img src={plantowatchDoc.data().image} alt={plantowatchDoc.data().title}/>
              <div className="overlay-dim">
                  <h3><span>{plantowatchDoc.data().title}</span></h3>
                  <p><span className="field-name">Episodes:</span> 
                  <br/>{plantowatchDoc.data().episodes}</p>
                  <p><span className="field-name">Released:</span> 
                  <br/>{plantowatchDoc.data().season}</p>
                  <p>({plantowatchDoc.data().common_users.join(", ")})</p>
                  <a href={plantowatchDoc.data().link}><button>see details on MyAnimeList</button></a>
              </div>
            </div>
          );
          this.setState({
            tempTier: thisItemTier
          });
          console.log("temp tier -> " + this.state.tempTier);
          return null;
      });
    }).catch((error) => {});
    
    this.setState((state) => ({
      listSummaryItems: state.listSummaryItems.concat(this.state.tempTier)
    }));
    console.log("thisTier finished running with no errors");
  }



  render() {
    
    if (this.state.listSummaryItems.length === 0) {
      return (
        <div>
          <button onClick={this.updateSummaryList}>Find titles everyone has in common!</button>
          <button onClick={this.retrieveAllItems}>get all items</button>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Titles you have in common! <button onClick={this.updateSummaryList}>Reload</button></h3> 
          
          <div>
            {this.state.listSummaryItems}
          </div>
        </div>
      );
    }
  }
}

export default ListSummary;
