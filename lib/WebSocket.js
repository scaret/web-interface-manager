import {BaseWebSocket} from "./web-base/BaseWebSocket";

var EventEmitter = require("eventemitter3");

//https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket

function WebSocketManager(){
  var self = this;
  self._ee = new EventEmitter();
}

WebSocketManager.prototype.register = function(socket){
  var self = this;
  self._ee.emit('socketRegister', socket);
  setTimeout(function(){
    self._ee.emit('socketAfterRegister', socket);
  }, 0);
};

WebSocketManager.prototype.on = function(eventName, listener){
  var self = this;
  self._ee.on(eventName, listener.bind(self));
};

var webSocketManager = new WebSocketManager();

function WebSocket(url, protocols){
  var self = this;
  self.url = url;
  self.protocols = protocols;
  webSocketManager.register(self);
  var socket = new BaseWebSocket(self.url, self.protocols);
  self.socket = socket;
  self.readyState = socket.readyState;

  socket.onopen = function(){
    self.readyState = socket.readyState;
    webSocketManager._ee.emit('socketOpen', self);
    self.onopen && self.onopen.apply(self, arguments);
  };

  socket.onclose = function(){
    self.readyState = socket.readyState;
    webSocketManager._ee.emit('socketClose', self);
    self.onclose && self.onclose.apply(self, arguments);
  };

  socket.onerror = function(e){
    self.readyState = socket.readyState;
    webSocketManager._ee.emit('socketError', self, e);
    self.onerror && self.onerror.apply(self, arguments);
  };

  socket.onmessage = function(message){
    self.readyState = socket.readyState;
    webSocketManager._ee.emit('socketMessage', self, message);
    self.onmessage && self.onmessage.apply(self, arguments);
  };
}

WebSocket.CONNECTING = 0;
WebSocket.OPEN = 1;
WebSocket.CLOSING = 2;
WebSocket.CLOSED = 3;

WebSocket.prototype.send = function(){
  var self = this;

  self.sendArgs = arguments;
  webSocketManager._ee.emit('socketBeforeSend', self);
  self.socket.send.apply(self.socket, self.sendArgs);
};

WebSocket.prototype.close = function(){
  var self = this;
  webSocketManager._ee.emit('socketBeforeClose', self);
  self.socket.close();
  self.readyState = self.socket.readyState;
};

export {

  WebSocket,

  webSocketManager

}
