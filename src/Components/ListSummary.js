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
  }
  
  componentDidMount() {
    //this.updateSummaryList();
  }

  componentDidUpdate() {
    this.props.loadingGIF(false);
  }

  updateSummaryList() {
    this.props.loadingGIF(true);
    console.log("ListSummary below:");
    //list all items with 2+ common users
    for (var i = this.props.usersInSessionCount; i > 1; i--) {
      this.constructItemTier(i);
    }
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
    
    this.setState({
      listSummaryItems: this.state.listSummaryItems.concat(this.state.tempTier)
    });
    console.log("thisTier finished running with no errors");
  }



  render() {
    console.log("list summary items = " + this.state.listSummaryItems);
    if (this.state.listSummaryItems.length === 0) {
      return (
        <div>
          <button onClick={this.updateSummaryList}>Find titles everyone has in common!</button>
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
