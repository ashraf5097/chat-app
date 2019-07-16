import React, { Component } from "react";
import "./App.css";
import socket from "./socket";
import moment from 'moment'
const queryString = require('query-string');


class ChatPage extends Component {

  state = {
    timestamp: 'no timestamp yet',
    client: socket(),
    welcomeMessage:[],
    message:"",
    textMessage:"",
    users: [],
    userSelf:"",
    room:"",
    width: 0,
  };

  componentDidMount () {
    this.state.client && this.state.client.welcomeMessage((err, newMessage )=>{
      this.setState({
        welcomeMessage : this.state.welcomeMessage.concat(newMessage)
      })
  });

    // this.state.client
    const parsed = queryString.parse(this.props.location.search);
    this.state.client.newUserJoin(parsed.username, parsed.room)
    this.state.client.userInroom((err, usersAndRoom) => {
      console.log("usersAndRoom = ", usersAndRoom);
      
      this.setState({
        users: usersAndRoom,
        room: parsed.room,
        userSelf:parsed.username
      })
    });
    this.scrollToBottom();
  }

  scrollToBottom = () => this.msgDivElement && this.msgDivElement.scrollIntoView({ behavior: 'smooth' });




  componentDidUpdate () {

     let width = this.divElement.clientWidth;
    if (width !== this.state.width) {
      this.setState({
        width
      })
    }
    let name = this.state.welcomeMessage.map(msg=> msg.username).pop()
    let parsed = queryString.parse(this.props.location.search);
    const username = parsed.username;
    if (name === username) this.scrollToBottom();
  }

  messageSend = (msg,locOrMsg)  =>{
    this.setState({
      textMessage: ''
    });

    if(locOrMsg === "msg") {
      this.state.client.sendMessage(msg);
    } else if(locOrMsg === "location") {
      window.navigator.geolocation.getCurrentPosition((position) => {
        this.state.client.sendLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
      });
      })
    }
  }
  
  handleChange = (event) => {
    this.setState({
      textMessage: event.target.value
    })
  }
  
  render() {
    
    return (
      <div className="App">
        <div class="chat">
          <div class="chat__sidebar">
            <div class="room">{ this.state.room}</div>
            { this.state.users && this.state.users.map(({username})=>{ return(this.state.userSelf !== username && <div>{username}</div>)}) }
            <div>You</div>
          </div>
  
          <div class=""
          >
            
            {/* <div id="messages" class="chat__messages">
            </div> */}

          <div class="message"
                    style={{overflowX:this.state.width<1000 ?"hidden":"auto",overflowY:this.state.width<1000 ?"hidden":"auto",paddingLeft:this.state.width<1000 ?"1%":"0%"}}

                  ref={ (divElement) => this.divElement = divElement}
          >
            {
              this.state.welcomeMessage.map((msg) => {
                  if ((msg.text && msg.text !== "") || msg.locationMessageUrl) {
                    return(
                      <>
                        <div>
                          <span class="message__name">{msg.username}</span>
                          <span class="message__meta">{moment((new Date().getTime())).format('h:mm a')}</span>
                        </div>
                        <div class="message_content"  ref={ (msgDivElement) => this.msgDivElement = msgDivElement}> 
                          <>{msg.text ? msg.text: <p><a href={msg.locationMessageUrl} target="_blank">My current location</a></p>}</>
                        </div>
                      </>
                    )
                  }
              })
            }
          </div>
  
            <div class="compose">
                <input name="message" placeholder="Message" required autocomplete="off" value={this.state.textMessage}
                  onChange = {(event) => this.handleChange(event)}
                />
                <button onClick={()=> this.messageSend(this.state.textMessage,"msg")}>Send</button>
                <button id="send-location" onClick={()=> this.messageSend(this.state.textMessage,"location")}>Send location</button>
            </div>
          </div>
        </div>

          {/* <div class="message">
                  <p>
                      <span class="message__name">{}</span>
                      <span class="message__meta">{}</span>
                  </p> 
                  <p><a href="{{locationMessageUrl}}" target="_blank" /></p>
          </div> */}
      </div>
    );
  }
}

export default ChatPage;