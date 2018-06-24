import FakeXMLHttpRequest from "fake-xml-http-request";

var BaseXMLHttpRequest = function(){
  var xhr = new FakeXMLHttpRequest();
  return xhr;
};

export {

  BaseXMLHttpRequest

}