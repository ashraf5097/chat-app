import React, { Component } from "react";
import "./App.css";
import socket from "./socket";

class JoinPage extends Component {
 
  state = {
    timestamp: 'no timestamp yet',
    client: socket(),
    welcomeMessage: "",
    username: "",
    room: ""
  };

 

  handleChange = (event) => {
      if (event.target.name === "username") {
        this.setState({
            username: event.target.value
        })
      } else {
          this.setState({
              room: event.target.value
          })
      }
  }

  newUserJoin = (username, room) => this.state.client.newUserJoin(username, room);

  render() {
    return (
      <div className="App">
       <div class="centered-form">
            <div class="centered-form__box">
                <h1>Join</h1>
                <form action="/chat">
                    <label>Display name</label>
                        <input type="text" name="username" placeholder="Display name" required autoComplete="off" onChange = {(event) => this.handleChange(event)} />
                    <label>Room</label>
                        <input type="text" name="room" placeholder="Room" required autoComplete="off" onChange = {(event) => this.handleChange(event)} />
                    <button >Join</button>
                </form>
            </div>
        </div>
      </div>
    );
  }
}

export default JoinPage;