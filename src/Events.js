const { EventEmitter } = require("events");
const commands = new EventEmitter;
class Events extends EventEmitter {
    constructor() {
        super();
        this.commands = commands;
    }
}
module.exports = { Events };