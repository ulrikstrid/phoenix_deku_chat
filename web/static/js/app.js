/** @jsx element */

import {Socket, LongPoller} from "../vendor/phoenix.js";
import element from 'virtual-element';
import {render, tree} from 'deku';
import Messages from './messages';

const chatMessages = [];

const app = tree(<Messages messages={[]} />);
app.set('messages', chatMessages);

console.log(app);

render(app, document.querySelector('#messages'));

let socket = new Socket("/socket", {
	logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
})

socket.connect({user_id: "123"})
var $status    = document.querySelector("#status")
var $input     = document.querySelector("#message-input")
var $username  = document.querySelector("#username")

socket.onOpen( ev => console.log("OPEN", ev) )
socket.onError( ev => console.log("ERROR", ev) )
socket.onClose( e => console.log("CLOSE", e))

var chan = socket.channel("rooms:lobby", {})
chan.join().receive("ignore", () => console.log("auth error"))
					 .receive("ok", () => console.log("join ok"))
					 .after(10000, () => console.log("Connection interruption"))
chan.onError(e => console.log("something went wrong", e))
chan.onClose(e => console.log("channel closed", e))

$input.removeEventListener("keypress");
$input.addEventListener("keypress", e => {
	if (e.keyCode == 13) {
		chan.push("new:msg", {user: $username.value, body: $input.value})
		$input.value = '';
	}
})

chan.on("new:msg", msg => {
	chatMessages.push(msg);
	app.set('messages', chatMessages);
})

chan.on("user:entered", msg => {
	msg.user = msg.user || "anonymous";
	chatMessages.push(msg);
	app.set('messages', chatMessages);
})
