'use strict';

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  // .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });
const loggedUsers = {}

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', function message(data) {
    console.log('received: %s', data);

    switch (data.type) {
      case 'login':
        loggedUsers[data.name] = ws;
        break;
      //when somebody wants to call us
      case 'offer':
        loggedUsers[data.name].send(data);
        break;
      case 'answer':
        loggedUsers[data.name].send(data);
        break;
      //when a remote peer sends an ice candidate to us
      case 'candidate':
        loggedUsers[data.name].send(data);
        break;
      case 'leave':
        loggedUsers[data.name].send(data);
        break;
      default:
        break;
    }
  });
  ws.on('close', () => console.log('Client disconnected'));

});