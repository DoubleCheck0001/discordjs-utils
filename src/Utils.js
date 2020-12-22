const { Events } = require("./Events");
const { Interactions } = require("./Interactions");
class Utils extends Events {
    constructor(config) {
        super();

        //Logging
        const logger = {
            info: function(msg) {
                if (config.debug) {
                    console.log(`[INFO] ${msg}`);
                }
            },
            warn: function(msg) {
                if (config.debug) {
                    console.warn(`[WARN] ${msg}`);
                }
            },
            error: function(msg) {
                if (config.debug) {
                    console.error(`[ERROR] ${msg}`);
                }
            }
        }
        this.logger = logger;

        //Interactions API
        let interactions;
        this.interactions = [ interactions ];
        this.interactions.init = function(token, ClientID) {
            interactions = new Interactions(token, ClientID);
            logger.info("Initialized Interactions class.");
        }
    }
}
module.exports = { Utils }
