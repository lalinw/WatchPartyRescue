import '../App.css';
import React from 'react';
import firebase from '../firebase';
 

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // userList: []
    }
    this.deleteUser = this.deleteUser.bind(this);
    // this.retrieveUserList = this.retrieveUserList.bind(this);
    this.userItemFormat = this.userItemFormat.bind(this);
  }
  
  componentDidMount() {
  }


  userItemFormat(eachUser) {
    return (
      <li key={eachUser}>
        {eachUser} 
        {eachUser !== this.props.user && <button id={eachUser} onClick={this.deleteUser}>Remove</button>}
      </li>
    );
  }

  
  deleteUser(event) {
    const user = event.target.id;
    if (window.confirm("You are about to delete user " + user + " AND all their votes.\nProceed?")) {
      const sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
      const summaryMAL = sessionRef.collection("summary").doc("myanimelist");
      const usersRef = sessionRef.collection("users");
      console.log("Deleting user", user);

      //delete this user's doc in users collection
      usersRef.doc(user).delete()
      .then(() => {
        console.log(user + " has been deleted.");
      })
      .catch((error) => {});

      summaryMAL.collection("plan_to_watch").where("common_users", "array-contains", user)
      .get().then((querySnapshot) => {
        querySnapshot.forEach( (thisDoc) => {
          summaryMAL.collection("plan_to_watch").doc(thisDoc.id).update({
            common_users: firebase.firestore.FieldValue.arrayRemove(user),
            occurrences: firebase.firestore.FieldValue.increment(-1)
          });
        })
      }).then(() => {
        console.log("summary list has been decremented with user");
      }).catch((error) => {});
      
      summaryMAL.collection("plan_to_watch").where("occurrences", "==", 0)
      .get().then((querySnapshot) => {
        querySnapshot.forEach( (doc) => {
          summaryMAL.collection("plan_to_watch").doc(doc.id).delete().then(() => {
            console.log("Document successfully deleted!");
          }).catch((error) => {
            console.error("Error removing document: ", error);
          });
        }) 
      });
      
      sessionRef.update({
        users_count: firebase.firestore.FieldValue.increment(-1)
      }).then(() => {
        this.props.recountUsers();
      });

    } 
  }

 
  render() {
    if (this.props.sessionID != null) {
      return (
        <div className="user-list">
          {this.props.userList.length === 0 
            ? <p><i>There are no users in this session yet</i></p> 
            : <React.Fragment>
              <p>Users in this session:</p>
              <ul>
                {this.props.userList.map((eachUser) => {
                  return this.userItemFormat(eachUser);
                })}
              </ul>
            </React.Fragment>}
        </div>
      );
    } else {
      return null;
    }
  } 

}

export default UserList;
