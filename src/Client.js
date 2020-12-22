const discord = require("discord.js")
const { Utils } = require("./Utils");
class Client extends Utils {
    constructor(config) {
        super(config);

        const client = new discord.Client();

        client.login(config.token).then(() => {
            this.logger.info("Bot authenticated.");
            this.interactions.init(config.token, client.user.id);
            this.emit("authenticated");
        }).catch((err) => {
            throw err;
        });

        client.once('ready', () => {
            this.client = client;
            this.emit('ready');
        });
    }
}
module.exports = { Client };


