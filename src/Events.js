const { EventEmitter } = require("events");
const commands = new EventEmitter;
const roles = new EventEmitter;
class Events extends EventEmitter {
    constructor() {
        super();
        this.commands = commands;
        this.roles = roles;
    }
}
module.exports = { Events };