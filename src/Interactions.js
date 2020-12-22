const interactionsClient = require("discord-slash-commands-client").Client;
class Interactions extends interactionsClient {
    constructor(token, clientID) {
        super(token,  clientID);

        this.registerCommand = function(name, description, options, callback) {
            name = name.toLowerCase();
            const data = {name, description, options};
            this.createCommand(data).then((commands) => {
                callback(null, commands);
            }).catch((err) => {
                callback(err);
            });
        }
        this.listCommands = function(callback) {
            this.getCommands().then((commands) => {
                callback(null, commands);
            }).catch((err) => {
                console.error(err);
                callback(err);
            });
        }
        this.unregisterCommand = function(name, callback) {
            this.listCommands((err, commands) => {
                if (err) {
                    callback(err);
                } else {
                    for (let command of commands.slash.all) {
                        if (command.name === name) {
                            this.deleteCommand(command.id).then(() => {
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