import { Component, OnInit, ViewChild } from '@angular/core';

declare var Peer: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit  {

  connection: any;

  videoSources: string[] = [];
  audioSources: string[] = [];

  myPeerId: string;
  peerId: string;

  logs = [];

  myStream: any;

  peer;

  message: string;

  ngOnInit() {
    let that = this;

    //Set My Peer ID
    this.myPeerId = `peer${Math.floor((Math.random() * 10) + 1)}`;

    this.displayMediaSourceList();

    //Create Peer
    this.peer = new Peer(this.myPeerId);
    console.log(`peer ${this.myPeerId} created.`)
    console.log(this.peer)

    /* navigator.mediaDevices.getUserMedia({ video: false, audio: false })
    .then((stream)=>{
      console.log('Got stream successfully');
      this.myStream = stream;
    }) */

    //Connect to Peer Server
    this.peer.on('open', function(id){
      console.log(`peer ${id} opened`);
    });

    //Receive Connection
    this.peer.on('connection', function(conn) {
      that.initConnection(conn);
    });
  };

  call(){
    console.log(`Calling: ${this.peerId}`);
    this.logs.push(`Calling: ${this.peerId}`);
    let conn = this.peer.connect(this.peerId);
    this.initConnection(conn);
  };

  sendMsg(){
    console.log('trying to send message...');
    console.log(this.message);

    console.log(`${this.myPeerId} is sending message to ${this.connection.peer}`)
    this.logs.push(`${this.myPeerId} is sending message to ${this.connection.peer}`);

    this.connection.send(this.message);
  }

  initConnection(conn){
    this.connection = conn;
    let peerId = this.myPeerId;
    console.log(this.logs)
    let logs = this.logs;

    console.log(`${peerId} is connected with ${conn.peer}`)
    logs.push(`${peerId} is connected with ${conn.peer}`);
    
    conn.on('data', function(data) {
      console.log(`${peerId} received ${data} from ${conn.peer}`);
      console.log(logs)
      logs.push(`${peerId} received ${data} from ${conn.peer}`);
    });
  };

  displayMediaSourceList(){
    navigator.mediaDevices.enumerateDevices().then((deviceInfos)=>{
        let audioCounter = 1;
        let videoCounter = 1;
        for(let deviceInfo of deviceInfos){          
          if(deviceInfo.kind === "audioinput"){
            this.audioSources.push(deviceInfo.label || `audio${audioCounter}`)
            audioCounter++;
          }else if(deviceInfo.kind === "videoinput"){
            this.videoSources.push(deviceInfo.label || `video${videoCounter}`)
            videoCounter++;
          };
        };
    });
  };


}
