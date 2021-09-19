import './App.css';
import React, { Component } from "react";
//Components
import Banner from "./Components/Banner";
import Session from "./Components/Session";


class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false
    };
    this.loadingGIF = this.loadingGIF.bind(this);
  }

  componentDidMount() {
  }
  

  loadingGIF(isLoading) {
    if (isLoading) {
      document.getElementById("popup-loading").style.display = "block";
      document.getElementById("popup-content").style.display = "block";
    } else {
      document.getElementById("popup-loading").style.display = "none";
      document.getElementById("popup-content").style.display = "none";
    }
  }


  render() {
    return (
      <React.Fragment>
          <Banner/>

          <Session
            loadingGIF = {this.loadingGIF}
          />
        </React.Fragment>
    );
  }

}

export default App;
