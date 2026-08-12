const EventEmitter = require('events');

class AppEventEmitter extends EventEmitter {}

const appEvents = new AppEventEmitter();
appEvents.setMaxListeners(20);

module.exports = appEvents;
