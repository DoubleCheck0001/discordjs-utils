const { Events } = require("./Events");
const { Interactions } = require("./Interactions");
class Utils extends Events {
    constructor(config) {
        super();

        //Logging
        const logger = {
            info: function(msg) {
                if (config.logging) {
                    console.log(`[INFO] ${msg}`);
                }
            },
            warn: function(msg) {
                if (config.logging) {
                    console.warn(`[WARN] ${msg}`);
                }
            },
            error: function(msg) {
                if (config.logging) {
                    console.error(`[ERROR] ${msg}`);
                }
            }
        }
        this.logger = logger;

        //Interactions API
        let interactions;
        this.interactionsClass = {
            get: function() {
               return interactions;
            },
            init: function(token, ClientID) {
                interactions = new Interactions(token, ClientID);
                logger.info("Initialized Interactions class.");
            }
        }
    }
}
module.exports = { Utils }
