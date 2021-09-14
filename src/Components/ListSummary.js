import '../App.css';
import React from 'react';
import ReactDOM from 'react-dom'
import firebase from '../firebase';



class ListSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allItems: [],
      countFilters: []
    };
    this.retrieveAllItems = this.retrieveAllItems.bind(this);
    this.animeItemFormat = this.animeItemFormat.bind(this);
    this.toggleCollapsible = this.toggleCollapsible.bind(this)
    this.setFiltersFromUsers = this.setFiltersFromUsers.bind(this)
  }
  
  componentDidMount() {
    this.setFiltersFromUsers();
  }

  componentDidUpdate() {
  }

  setFiltersFromUsers() {
    var filter = [];
    for (var i = this.props.usersInSessionCount; i > 1; i--) {
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
          img:          plantowatchDoc.data().image,
          title:        plantowatchDoc.data().title,
          eps:          plantowatchDoc.data().episodes,
          season:       plantowatchDoc.data().season,
          common_users: plantowatchDoc.data().common_users.join(", "),
          users_count:  plantowatchDoc.data().occurrences,
          link:         plantowatchDoc.data().link
        };
        // console.log(item.title);
        this.setState(state => ({
          allItems: [...state.allItems, item]
        }));        
      });
      
    })
    .then(() => {
      console.log("all items retrieved!");
    });
  }

 
  animeItemFormat(itemObject) {
    // console.log("item format called");
    return (
      <div className="poster-image" key={itemObject.id}>
        <img src={itemObject.img} alt={itemObject.title}/>
        <div className="overlay-dim">
            <h3><span>{itemObject.title}</span></h3>
            <p>
              <span className="field-name">Episodes:</span> 
              <br/>{itemObject.eps}
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
    // console.log(this.state.countFilters);
    // console.log("list summary items (all) = " + this.state.allItems);
    if (this.state.allItems.length > 0) {
      return (
        <div>
          <h3>Titles you have in common! <button onClick={this.retrieveAllItems}>Reload</button></h3> 
          <div id="tiers">
            {
              this.state.countFilters.map((thisFilter) => {
                var thisTier = this.state.allItems.filter(item => item.users_count == thisFilter.count);
                return (
                  
                  <div className="item-tier">
                    <button key={thisFilter.count} onClick={ () => this.toggleCollapsible(thisFilter.count) }>
                      <p>Titles sharing {thisFilter.count} common users ({thisTier.length}):</p>
                    </button>
                    <div className={"tier-content" + (thisFilter.show ? ' open' : '')}>
                      {
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
        <div>
          <button onClick={this.retrieveAllItems}>Find titles everyone has in common!</button>
          <div id="item-tiers"></div>
        </div>
      );
    }
  }
}

export default ListSummary;
