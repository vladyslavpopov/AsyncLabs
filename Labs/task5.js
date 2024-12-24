const EventEmitter = require("events");

class MessageHub extends EventEmitter {}
const messageHub = new MessageHub();

class Notifier {
  constructor(hub) {
    hub.on("notification", (data) => {
      console.log(`[Notification]: ${data.content}`);
    });
  }
}

const notifier = new Notifier(messageHub);

function sendMessage(type, content) {
  messageHub.emit(type, { type, content });
}

sendMessage("notification", "You have new message");
sendMessage("notification", "Your task is completed");
