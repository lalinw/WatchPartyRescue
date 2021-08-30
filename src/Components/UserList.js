import '../App.css';
import React from 'react';
import firebase from '../firebase';


class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: []
    }
    this.deleteUser = this.deleteUser.bind(this);

  }
  
  componentDidMount() {
    var sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
    var usersRef = sessionRef.collection("users");

    //populate userList state for user management 
    usersRef.onSnapshot((userDocs) => {
      var localUsers = [];
      console.log("userDocs = " + userDocs.size);
      userDocs.forEach((theUser) => {
        localUsers = localUsers.concat(theUser.id);
        console.log("userdocs = " + theUser);
      });
      this.setState({
        userList: localUsers
      });
      console.log("userlist state = " + this.state.userList);
    });

  }

  deleteUser(event) {
    var user = event.target.id;
    if (window.confirm("You are about to delete user " + user + " AND all their votes.\nProceed?")) {
      var sessionRef = firebase.firestore().collection("session").doc(this.props.sessionID);
      var summaryMAL = sessionRef.collection("summary").doc("myanimelist");
      var usersRef = sessionRef.collection("users");

      console.log("Deleting user", user);

      //delete this user's doc in users collection
      usersRef.doc(user).delete()
        .then(() => {
          console.log(user + " has been deleted.");
        })
        .catch((error) => {});

      console.log("after update");

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
      

      console.log("after array-contains");

      summaryMAL.collection("plan_to_watch").where("occurrences", "==", 0)
        .onSnapshot((querySnapshot) => {
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
      });
    } 
  }

 
  render() {
    var displayUsers = [];
    for (var i = 0; i < this.state.userList.length; i++) {
      var username = this.state.userList[i];
      if (username == this.props.user) {
        displayUsers.push(
          <li>
            {username}
          </li>
        )
      } else {
        displayUsers.push(
          <li>
            {username} <button id={username} onClick={this.deleteUser}>Remove</button>
          </li>
        );
      }
    }
    return (
      <div>
        {this.state.userList.length == 0 ? 
        <p><i>There are no users in this session yet</i></p> :
        <React.Fragment>
          <p>Users in this session:</p>
          <ul>
            {displayUsers}
          </ul>
        </React.Fragment>}
      </div>
    )
  }
}

export default UserList;
