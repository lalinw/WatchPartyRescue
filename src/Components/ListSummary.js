import '../App.css';
import React from 'react';
import firebase from '../firebase';


class ListSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allItems: [],
      countFilters: [
        {
          count: 0,
          show: false
        }
      ],
      fetched: false
    };
    this.retrieveAllItems = this.retrieveAllItems.bind(this); 
    this.animeItemFormat = this.animeItemFormat.bind(this);
    this.toggleCollapsible = this.toggleCollapsible.bind(this)
    this.setFiltersOnUsersCount = this.setFiltersOnUsersCount.bind(this)
  }
  

  componentDidMount() {
    this.setFiltersOnUsersCount();
    const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    const usersRef = sessionRef.collection("users");

    usersRef.doc(this.props.user).get().then( (doc) => {
      if (doc.exists) {
        if(doc.get('last_fetched') !== undefined){
          this.setState({
            fetched: true
          });
          console.log("last_fetched field exists");
        }
      } else {
        console.log("last_fetched cannot be found");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
  }


  componentDidUpdate() {
    if (this.props.userList.length > 2 && this.props.userList.length !== this.state.countFilters[0].count) {
      this.setFiltersOnUsersCount();
    }
  }


  setFiltersOnUsersCount() {
    var filter = [];
    for (var i = this.props.userList.length ; i > 1; i--) {
      var tier = {
        count: i,
        show: false
      };
      filter.push(tier);
    }
    this.setState({
      countFilters: filter
    });
  }


  retrieveAllItems() {
    //reset state
    this.setState({
      allItems: []
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
          image:        plantowatchDoc.data().image,
          title:        plantowatchDoc.data().title,
          episodes:     plantowatchDoc.data().episodes,
          season:       plantowatchDoc.data().season,
          common_users: plantowatchDoc.data().common_users.join(", "),
          occurrences:  plantowatchDoc.data().occurrences,
          link:         plantowatchDoc.data().link
        };
        // console.log(item.title);
        return this.setState(state => ({
          allItems: [...state.allItems, item]
        }));        
      });
      
    })
    .then(() => {
      console.log("all items retrieved!");
      const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
      const summaryMAL = sessionRef.collection("summary").doc("myanimelist");
      summaryMAL
      .set({
        latest_retrieval: firebase.firestore.FieldValue.serverTimestamp()
      }, { 
        merge: true 
      });
    });
  }

 
  animeItemFormat(itemObject) {
    return (
      <div className="poster-image" key={itemObject.id}>
        <img src={itemObject.image} alt={itemObject.title}/>
        <div className="overlay-dim">
            <h3><span>{itemObject.title}</span></h3>
            <p>
              <span className="field-name">Episodes:</span> 
              <br/>{itemObject.episodes}
            </p>
            <p>
              <span className="field-name">Released:</span> 
              <br/>{itemObject.season}
            </p>
            <p>({itemObject.common_users})</p>
            <a href={itemObject.link}><button>see details on MyAnimeList</button></a>
        </div>
      </div>
    );
  }

  
  toggleCollapsible(countAsKey) {
    console.log("toggle collapsible called");
    console.log("toggle collapsible ///" + countAsKey);
    console.log(this.state.countFilters);
    var newCountFilters = this.state.countFilters.map(filter => 
      (filter.count === countAsKey ? {...filter, show: !filter.show}: filter) 
    )
    console.log(newCountFilters);
    this.setState({
      countFilters: newCountFilters
    });
  }

  render() {
    if (this.state.allItems.length > 0) {
      return (
        <div className="summary">
          <h3>Titles you have in common! <button onClick={this.retrieveAllItems}>Reload</button></h3> 
          <div id="tiers">
            {
              this.state.countFilters.map((thisFilter) => {
                var thisTier = this.state.allItems.filter(item => item.occurrences === thisFilter.count);
                return (
                  <div key={"tier-" + thisFilter.count} className="item-tier">
                    <button 
                      key={"tierbtn-" + thisFilter.count} 
                      className={"collapsible" + (thisFilter.show ? ' open' : '')}
                      onClick={ () => this.toggleCollapsible(thisFilter.count) }>
                      <p>Titles sharing {thisFilter.count} common users ({thisTier.length}):</p>
                    </button>
                    <div 
                      key={"tiercontent-" + thisFilter.count} 
                      className={"tier-content" + (thisFilter.show ? ' open' : '')}>
                      {
                        thisTier.length < 1
                        ?
                        <p>There are no titles shared between {thisFilter.count} users</p>
                        :
                        thisTier.map((eachItem) => {
                          return this.animeItemFormat(eachItem);
                        })
                      }
                    </div>
                    
                  </div>
                );
              })
            }
          </div>
        </div>
      );
    } else {
      return (
        <div className="summary alt">
          {!this.state.fetched && <p>Warning: Your list has not been fetched</p>}
          <button 
            onClick={ () => {
              if (this.props.userList.length  < 2) {
                window.alert("Cannot compare list between fewer than 2 users.\nInvite more people and fetch their list(s) to proceed.");
              } else {
                this.retrieveAllItems();
              }
            }}>
            Compare everyone's lists!
          </button>
        </div>
      );
    }
  }
}

export default ListSummary;
