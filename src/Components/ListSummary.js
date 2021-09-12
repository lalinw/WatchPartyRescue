import '../App.css';
import React from 'react';
import ReactDOM from 'react-dom'
import firebase from '../firebase';



class ListSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listSummaryItems: [],
      listDisplay: [],
    };
    this.constructItemTier = this.constructItemTier.bind(this);
    this.showSummaryList = this.showSummaryList.bind(this);
    this.retrieveAllItems = this.retrieveAllItems.bind(this);
    this.animeItemFormat = this.animeItemFormat.bind(this);
    this.tierFormat = this.tierFormat.bind(this);
    
  }
  
  componentDidMount() {
    //this.updateSummaryList();
  }

  componentDidUpdate() {
    // this.props.loadingGIF(false);
  }

  showSummaryList() {
    
    console.log("ListSummary below:");
    //list all items with 2+ common users
    this.retrieveAllItems();
    for (var i = this.props.usersInSessionCount; i > 1; i--) {
      var thisTier = this.state.listSummaryItems.filter(item => item.users_count == i)
      if (thisTier.length > 0) {
        this.tierFormat(thisTier, i);
      }
      
    }
  }

  tierFormat(tierArray, countFilter) {
    console.log("tierFormat() is called w/ " + countFilter);
    //but where to return this to??
    this.setState(state => {
      listDisplay: state.listDisplay.push(
        <div className="item-tier">
          <p>Titles sharing {countFilter} common users:</p>
          {
            tierArray
            .map((eachItem) => {
              return this.animeItemFormat(eachItem);
            })
          }
        </div>
      )
      
    });
  }

  retrieveAllItems() {
    //reset 
    this.setState({
      listSummaryItems: []
    });

    console.log("retrieveAllItems started...");
    //retrieve all items and save to state
    //array of objects 
    const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    const summaryMAL = sessionRef.collection("summary").doc("myanimelist");
    const MALplantowatch = summaryMAL.collection("plan_to_watch");

    MALplantowatch.get()
    .then((allItems) => {
      allItems.docs.map((plantowatchDoc) => {
        var item = 
        {
          img:          plantowatchDoc.data().image,
          title:        plantowatchDoc.data().title,
          eps:          plantowatchDoc.data().episodes,
          season:       plantowatchDoc.data().season,
          common_users: plantowatchDoc.data().common_users.join(", "),
          users_count:  plantowatchDoc.data().occurrences,
          link:         plantowatchDoc.data().link
        };
        console.log(item.title);
        this.setState(state => ({
          listSummaryItems: [...state.listSummaryItems, item]
        }));        
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
    
    // console.log("users => " + usersCount);
    // await MALplantowatch.where('occurrences', "==", usersCount).get()
    // .then((querySnapshot) => {
    //   var thisItemTier = [];
    //   thisItemTier.push(
    //     <div className="item-tier">
    //       <p>Items with {usersCount} votes</p>
    //     </div>
    //   );
    //   console.log(thisItemTier);
    //   querySnapshot.docs.map( (plantowatchDoc)=> {
    //       thisItemTier.push(
    //         <div className="poster-image">
    //           <img src={plantowatchDoc.data().image} alt={plantowatchDoc.data().title}/>
    //           <div className="overlay-dim">
    //               <h3><span>{plantowatchDoc.data().title}</span></h3>
    //               <p><span className="field-name">Episodes:</span> 
    //               <br/>{plantowatchDoc.data().episodes}</p>
    //               <p><span className="field-name">Released:</span> 
    //               <br/>{plantowatchDoc.data().season}</p>
    //               <p>({plantowatchDoc.data().common_users.join(", ")})</p>
    //               <a href={plantowatchDoc.data().link}><button>see details on MyAnimeList</button></a>
    //           </div>
    //         </div>
    //       );
    //       this.setState({
    //         tempTier: thisItemTier
    //       });
    //       console.log("temp tier -> " + this.state.tempTier);
    //       return null;
    //   });
    // }).catch((error) => {});
    
    // this.setState((state) => ({
    //   listSummaryItems: state.listSummaryItems.concat(this.state.tempTier)
    // }));
    // console.log("thisTier finished running with no errors");
  }

  animeItemFormat(itemObject) {
    return (
      <div className="poster-image">
        <img src={itemObject.img} alt={itemObject.title}/>
        <div className="overlay-dim">
            <h3><span>{itemObject.title}</span></h3>
            <p><span className="field-name">Episodes:</span> 
            <br/>{itemObject.eps}</p>
            <p><span className="field-name">Released:</span> 
            <br/>{itemObject.season}</p>
            <p>({itemObject.common_users})</p>
            <a href={itemObject.link}><button>see details on MyAnimeList</button></a>
        </div>
      </div>
    );
  }


  render() {
    
    if (this.state.listSummaryItems.length === 0) {
      return (
        <div>
          <button onClick={this.showSummaryList}>Find titles everyone has in common!</button>
          <button onClick={this.retrieveAllItems}>get all items</button>
          <div id="item-tiers"></div>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Titles you have in common! <button onClick={this.showSummaryList}>Reload</button></h3> 
          <button onClick={this.retrieveAllItems}>Retrieve All</button>
          <div id="item-tiers">
            {this.state.listDisplay}
          </div>
        </div>
      );
    }
  }
}

export default ListSummary;
