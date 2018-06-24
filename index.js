import {XMLHttpRequest, xmlHttpRequestManager} from "./lib/XMLHttpRequest";
import {WebSocket, webSocketManager} from "./lib/WebSocket";

window.XMLHttpRequest = XMLHttpRequest;

window.WebSocket = WebSocket;

export {

  xmlHttpRequestManager,

  webSocketManager,

}