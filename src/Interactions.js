const interactionsClient = require("discord-slash-commands-client").Client;
class Interactions extends interactionsClient {
    constructor(token, clientID) {
        super(token,  clientID);

        this.listCommands = function(callback) {
            this.getCommands().then((commands) => {
                callback(null, commands);
            }).catch((err) => {
                console.error(err);
                callback(err);
            });
        }

        //Store commands in a Map for easy access
        this.commands = new Map();
        this.listCommands((err, commands) => {
            if (err) {
                throw err;
            } else {
                for (let command of commands) {
                    this.commands.set(command.name, command);
                }
            }
        })

        this.registerCommand = function(name, description, options, callback) {
            name = name.toLowerCase();
            const data = {name, description, options};
            this.createCommand(data).then((command) => {
                if (!this.commands.get(name))  { //Add command to Map if it does not exist
                    this.commands.set(name, command);
                }
                callback(null, command);
            }).catch((err) => {
                callback(err);
            });
        }
        this.unregisterCommand = function(name, callback) {
            this.listCommands((err, commands) => {
                if (err) {
                    callback(err);
                } else {
                    for (let command of commands) {
                        if (command.name === name) {
                            this.deleteCommand(command.id).then(() => {
                                if (this.commands.get(name))  { //Remove command to Map if it exists
                                    this.commands.delete(name);
                                }
                                callback(null, "Deleted slash command with name", command.name, "and ID", command.id);
                            }).catch((err) => {
                                callback(err);
                            });
                        }
                    }
                }
            });
        }
        this.editCommand = function(type, name, description, options) {
            //to do
        }
    }
}
module.exports = { Interactions }