import '../App.css';
import React from 'react';
import firebase from '../firebase';
import UserList from "./UserList";
import UserInfoMAL from "./UserInfoMAL";

 

class Manage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  
  componentDidMount() {
  }
 
  render() {
    return (
      //Settings page
      // userlist
      // fetch status
      // session name update
      // 

      <React.Fragment>
        
        <UserInfoMAL
          sessionID = {this.props.sessionID}
          user = {this.props.user}
          loadingGIF = {this.props.loadingGIF}
        />

        <UserList
          sessionID = {this.props.sessionID}
          user = {this.props.user}
          existingUsers = {this.props.existingUsers}
          loadingGIF = {this.props.loadingGIF}
        />
      </React.Fragment>
    );
  } 

}

export default Manage;
