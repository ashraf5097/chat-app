import React, { Component } from "react";
import { Route } from 'react-router-dom';
import "./App.css";
import JoinPage from './JoinPage';
import ChatPage from './ChatPage';
 
class App extends Component {

  render() {
    
    return (
      <div className="App">
        <Route exact path="/" component={JoinPage} />
        <Route path="/chat" component={ChatPage} />
        
      </div>
    );
  }
}

export default App;