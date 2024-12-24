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

class Logger {
  constructor(hub) {
    hub.on("message", (data) => {
      console.log(`[Logger]: Recieved new message - ${data.type}`);
    });
  }
}

class ErrorHandler {
  constructor(hub) {
    hub.on("error", (data) => {
      console.error(`[Error]: ${data.content}`);
    });
  }
}

const notifier = new Notifier(messageHub);
const logger = new Logger(messageHub);
const errorHandler = new ErrorHandler(messageHub);

function sendMessage(type, content) {
  messageHub.emit(type, { type, content });
  messageHub.emit("message", { type, content });
}

sendMessage("notification", "You have new message");
sendMessage("notification", "Your task is completed");
sendMessage("error", "Database connection failure.");
sendMessage("error", "Not enough memory.");
