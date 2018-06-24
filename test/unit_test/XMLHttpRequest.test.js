const {XMLHttpRequest, xmlHttpRequestManager} = require("../../lib/XMLHttpRequest");

var expect = require('chai').expect;

describe('XMLHTTPRequest with real XMLHTTPRequest', function(){

  it('Should register to XMLHTTPRequestManager', function(done){
    var xhrArray = [];
    var xhrRegisteredArray = [];
    xmlHttpRequestManager.on('xhrRegister', function(xhrRegister){
      xhrRegisteredArray.push(xhrRegister);
    });
    for (var i = 0; i < 100; i++){
      xhrArray.push(new XMLHttpRequest());
    }

    for (var i in xhrArray){
      var xhr = xhrArray[i];
      expect(xhr).to.be.equal(xhrRegisteredArray[i]);
    }
    expect(xhrArray.length).to.be.equal(xhrRegisteredArray.length);
    done();
  });


  it('Should have ability to observe method XMLHTTPRequestManager', function(done){
    var i = 0;
    xmlHttpRequestManager.on('xhrBeforeOpen', function(xhr){
      i++;
      expect(i).to.be.equal(1);
      expect(xhr.readyState).to.be.equal(0);
      expect(xhr.openArgs[0]).to.be.equal("POST");
      expect(xhr.openArgs[1]).to.be.equal("https://agora.io");
      expect(xhr.openArgs[2]).to.be.equal(true);
      expect(xhr.timeout).to.be.equal(5000);
    });

    xmlHttpRequestManager.on('xhrBeforeSend', function(xhr){
      i++;
      expect(i).to.be.equal(2);
      expect(xhr.sendArgs[0]).to.be.equal("Hello World");
    });

    xmlHttpRequestManager.on('xhrAfterSend', function(xhr){
      i++;
      expect(i).to.be.equal(3);
      xhr.xhr.respond(200, {'Content-Type': 'application/json'}, "Hello Back");
    });

    xmlHttpRequestManager.on('xhrBeforeLoad', function(xhr){
      i++;
      expect(i).to.be.equal(4);
      expect(xhr.responseText).to.be.equal("Hello Back");
      done();
    });

    var xhr = new XMLHttpRequest();
    xhr.timeout = 5000;
    xhr.open("POST", "https://agora.io", true);
    xhr.setRequestHeader("Content-Type", "mock/header");
    xhr.send("Hello World");
    });
});