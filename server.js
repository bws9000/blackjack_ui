const path = require('path');
const express = require('express');
const app = express();

const socket = require('socket.io-client')
('https://calm-eyrie-37824.herokuapp.com/blackjack');

socket.on('connect', function () {
  socket.emit('authentication', {devuser: process.env.DEV_PASS });
  socket.on('authenticated', function () {
    console.log('authenticated');
  });
});

  /*
  socket.on('connect', function(){ console.log('connected'); });
  socket.on('event', function(data){});
  socket.on('disconnect', function(){});
  */

  app.use(express.static(__dirname + '/dist/angulartemp'));

  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/angulartemp/index.html'));
  });

  app.listen(process.env.PORT || 5000);
