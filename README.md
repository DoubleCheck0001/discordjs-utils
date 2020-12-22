# Discord.JS Utils
*The all-in-one utility package for Discord.js*

## Getting Started
This package is meant to be a replacement of Discord.JS. All of Discord.JS' features are accessible through this package.
### Installing
```bash
npm i https://github.com/CM8DoubleCheck/discordjs-utils
```

### Initializing
```javascript
const Discord = require("discordjs-utils");

const config = {
    token: "CHANGEME",
    prefix: "-",
    cooldown: 8,
    logging: true
}

const bot = new Discord.Client(config); //Initialize the bot

bot.once("ready", () => {
    bot.registerCommand("text", "ping"); //Register "ping" command
    bot.setActivity("WATCHING", "for -ping", (err, presence)  => {
        if (err) {
            console.error(err);
        } else {
            bot.logger.info("Presence Updated");
        }
    });
});

bot.commands.on("ping", (event) => { //Handle ping command
    event.send("Pong!");
});
```

## API
The idea of this utility package is to provide not only an improved way of handling commands but to provide more expansive methods for interacting with the Discord API. Because the package is based off Discord.JS, it comes with the already expansive library provided by that package.

#### The `bot` variable
| Variable   | Function                            |
|------------|-------------------------------------|
| bot.client | Discord.JS' client variable         |
| bot.embed  | Discord.JS' MessageEmbed class      |
| bot.config | Config provided at initialization   |
| bot.logger | See [Accessing the internal logger](https://github.com/CM8DoubleCheck/discordjs-utils#accessing-the-internal-logger) |

### Functions

#### Initializing the bot:
```javascript
const config = {
    token: "CHANGEME",
    prefix: "-",
    cooldown: 8,
    logging: true
}
const bot = new Discord.Client(config);
```
#### Setting the bot's presence
*Cannot be done prior to the ready event being called*
```javascript
bot.setActivity("WATCHING", "for -ping", (err, presence)  => {
    if (err) {
        console.error(err); //error occured when updating/setting the bot's presence
    } else {
        //bots presence has been updated successfully
    }
});
```

#### Registering a test command
```javascript
bot.registerCommand("text", "{name}");
```

#### Registering a slash (interactions) command
```javascript
bot.registerCommand("slash", "{name}", "{description}", [
    {
        name: "{argument 1}", 
        "description": "{argument 1 description}", 
        type: "3", 
        required: true, 
        "choices": [
            {
                "name": "{choice 1}", 
                "value": "{choice 1 value}"
            }, {
                "name": "{choice 2}", 
                "value": "{choice 2 value}"
            }
        ]
    }
]);
```
Please read more about slash command formats here: https://discord.com/developers/docs/interactions/slash-commands

#### Accessing the internal logger
```javascript
bot.logger.info("This is an info message");
bot.logger.warn("This is a warning message");
bot.logger.error("Uh oh! An error has occured");
```

### Events
#### Authenticated
```javascript
bot.once("authenticated", () => {
   //Called when the bot has authenticated with the Discord API
});
```
#### Ready
```javascript
bot.once("ready", () => {
   //Called when the bot is ready
});
```

#### Command
```javascript
bot.commands.on("COMMAND", (event) => {
    event.send("RESPONSE");
});
```
`event` callback variable:

| Variable           | Function                                                  |
|--------------------|-----------------------------------------------------------|
| event.getRaw()     | Gets the unaltered response from the Discord API          |
| event.getAuthor()  | Returns the author array                                  |
| event.getMember()  | Returns the member array                                  |
| event.send()       | Sends a response back. Can either be a string or an embed |
| event.reply()      | Similar to event.send() except it tags the author first.  |
| event.getArgs()    | Returns the arguments of a command as an object           |
| event.getContent() | Returns the string after the command                      |

#### Guild Member Join
*User joined server event*

```javascript
bot.on("join", (member) => {
    // User joined Server
    // member callback variable is left unchanged from Discord.JS
});
```
#### Guild Member Leave
*User left server event*

```javascript
bot.on("leave", (member) => {
    // User joined Server
    // member callback variable is left unchanged from Discord.JS
});
```

#### Role Added
*Called when a member's receives a role*
```javascript
bot.roles.on("added", (member, addedRoles) =>  {
    // member callback variable is left unchanged from Discord.JS
    // addedRoles is an array of roles added
});
```
#### Role Removed
*Called when a member's receives a role*
```javascript
bot.roles.on("removed", (member, removedRoles) =>  {
    // member callback variable is left unchanged from Discord.JS
    // removedRoles is an array of roles removed
});
```