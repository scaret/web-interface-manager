import {BaseXMLHttpRequest} from "./web-base/BaseXMLHttpRequest"

var EventEmitter = require("eventemitter3");

//https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest

function XMLHttpRequestManager(){
  var self = this;
  self._ee = new EventEmitter();
}

XMLHttpRequestManager.prototype.register = function(xhr){
  var self = this;
  self._ee.emit('xhrRegister', xhr);
  setTimeout(function(){
    self._ee.emit('xhrAfterRegister', xhr);
  }, 0);
};

XMLHttpRequestManager.prototype.on = function(eventName, listener){
  var self = this;
  self._ee.on(eventName, listener.bind(self));
};

var xmlHttpRequestManager = new XMLHttpRequestManager();

function XMLHttpRequest(){
  var self = this;
  self.readyState = XMLHttpRequest.UNSENT;
  self.headers = [];
  xmlHttpRequestManager.register(self);
}

XMLHttpRequest.UNSENT = 0;
XMLHttpRequest.OPENED = 1;
XMLHttpRequest.HEADERS_RECEIVED = 2;
XMLHttpRequest.LOADING = 3;
XMLHttpRequest.DONE = 4;

XMLHttpRequest.prototype.open = function(){
  var self = this;
  var xhr = new BaseXMLHttpRequest();
  self.xhr = xhr;

  self.openArgs = arguments;

  xhr.onreadystatechange = function(){
    self.readyState = xhr.readyState;
    self.onreadystatechange  && self.onreadystatechange.apply(self, arguments);
  };

  xhr.onload = function(){
    self.responseText = xhr.responseText;
    xmlHttpRequestManager._ee.emit('xhrBeforeLoad', self);
    self.onload  && self.onload.apply(self, arguments);
  };

  xhr.onerror = function(){
    self.responseText = xhr.responseText;
    self.onerror  && self.onerror.apply(self, arguments);
  };

  xhr.onprogress = function(){
    self.onprogress  && self.onprogress.apply(self, arguments);
  };

  xmlHttpRequestManager._ee.emit('xhrBeforeOpen', self);

  if (self.headers && self.headers.length){
    for (var i in self.headers){
      xhr.setRequestHeader.apply(xhr, self.headers[i]);
    }
    self.headers = [];
  }
  if (self.timeout){
    xhr.timeout = self.timeout;
  }

  xhr.open.apply(xhr, self.openArgs);
};

XMLHttpRequest.prototype.send = function(){
  var self = this;
  if (self.xhr){
    self.sendArgs = arguments;
    xmlHttpRequestManager._ee.emit('xhrBeforeSend', self);
    self.xhr.send.apply(self.xhr, self.sendArgs);
    xmlHttpRequestManager._ee.emit('xhrAfterSend', self);
  }else{
    throw new Error('OPEN FIRST');
  }
};

XMLHttpRequest.prototype.setRequestHeader = function(){
  var self = this;
  if (self.xhr){
    self.xhr.setRequestHeader.apply(self.xhr, arguments);
  }else{
    self.xhr.headers.push(arguments);
  }
};

export {

  XMLHttpRequest,

  xmlHttpRequestManager

}
