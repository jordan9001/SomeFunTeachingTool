#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
 
var server = http.createServer(function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);

  var file = "./index.html";
  if (request.url == "/chat.js") {
    file = "./chat.js";
  }
  var fstream = fs.createReadStream(file);
  fstream.pipe(response);

});
server.listen(8080, function() {
  console.log((new Date()) + ' Server is listening on port 8080');
});
 
wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});
 
wsServer.on('request', function(request) {
  var connection = request.accept('whitehead-protocol', request.origin);
  console.log((new Date()) + ' Connection accepted.');
  connection.on('message', function(message) {
    console.log('Received Message: ' + message.utf8Data);
    for (conn of wsServer.connections) {
        conn.sendUTF(message.utf8Data);
    }
  });
  connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});
