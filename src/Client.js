const discord = require("discord.js")
const { Utils } = require("./Utils");
class Client extends Utils {
    constructor(config) {
        super(config);

        //Initial setup
        const client = new discord.Client();

        client.login(config.token).then(() => {
            this.logger.info("Bot authenticated.");
            this.interactionsClass.init(config.token, client.user.id);
            this.interactions = this.interactionsClass.get();
            this.emit("authenticated");
        }).catch((err) => {
            throw err;
        });

        client.once('ready', () => {
            this.logger.info("Done.")
            this.emit('ready');

        });

        // General purpose functions
        this.split = function (content) {
            return content.split(/ +/);
        }


        //Message/Command Handling

        //Set for checking if a user is using commands too fast
        const cooldown = new Set();

        //Set for managing active text commands
        const textCommands = new Set();

        //Registering Commands
        this.registerCommand = function (type, name, description, options) {
            name = name.toLowerCase();
            if (type === "slash") {
                //slash command
                this.interactions.registerCommand(type, description, options, (err) => {
                    if (err) {
                        this.logger.error(`Failed to register ${type} command: ${name}`);
                    } else {
                        this.logger.info(`Registered ${type} command: ${name}`);
                    }
                })

            } else {
                textCommands.add(name);
                this.logger.info(`Registered text command: ${name}`);
            }
        }

        //Unregistering Commands
        this.unregisterCommand = function(type, name) {
            this.listCommands((err, commands) => {
                if (err) {
                    console.error(err);
                } else {
                    if (type === "slash") {
                        this.interactions.unregisterCommand(name, (err) => {
                            if (err) {
                                this.logger.error(`Failed to unregister ${type} command: ${name}`);
                            } else {
                                this.logger.info(`Unregistered ${type} command: ${name}`);
                            }
                        })
                    } else {
                        if (textCommands.has(name)) {
                            textCommands.delete(name);
                            this.logger.info(`Unregistered text command: ${name}`);
                        }
                    }

                }
            });
        }

        //Interaction (Slash) command handling
        client.on("interactionCreate", (interaction) => {
            const command = interaction.name.toLowerCase();
            const content = interaction.content;
            if (this.interactions.commands.get(command)) {
                //command exists
                if (cooldown.has(interaction.author.id)) {
                    interaction.channel.send(interaction.member+", you must wait `" + config.cooldown + "s` between commands.").then(() => {
                        this.logger.warn(`${interaction.author.username}#${interaction.author.discriminator} (${interaction.author.id}) issued command too quickly: ${command} ${content}`)
                    }).catch(console.log);
                } else {
                    cooldown.add(interaction.author.id);
                    const utils = {
                        getRaw: function () {
                            return interaction;
                        },
                        getAuthor: function () {
                            return interaction.author;
                        },
                        getMember: function () {
                            const member = interaction.member
                            member.avatarURL = function () {
                                //fix this later
                                return null;
                            }
                            return member;
                        },
                        send: async function (data) {
                            const response = interaction.channel.send(data);
                            await response;
                            return response;
                        },
                        reply: async function (data) {
                            if (typeof data === "string") {
                                data = `${this.getMember()}, ${data}`
                                return await this.send(data);
                            }
                        },
                        getArgs: function () {
                            const args = [];
                            interaction.options.forEach((arg) => {
                                args.push(arg);
                            })
                            return args;
                        },
                        getContent: function () {
                            return content;
                        }
                    }
                    this.commands.emit(command, utils);
                    setTimeout(() => {
                        //Removes the user from the set after the cooldown.
                        cooldown.delete(interaction.author.id);
                    }, config.cooldown * 1000);
                }
            }
        });

        //Normal (text) command handling
        client.on('message', (message) => {
            if (message.guild) {
                if (message.author.bot) return; //ignore other bot messages
                if (message.content.startsWith(config.prefix)) {
                    let content = message.content.slice(config.prefix.length).trim();
                    const args = this.split(content);
                    const command = args.shift().toLowerCase();
                    if (textCommands.has(command)) { //message is a command
                        if (cooldown.has(message.author.id)) {
                            message.reply("you must wait `" + config.cooldown + "s` between commands.").then(() => {
                                this.logger.warn(`${message.author.username}#${message.author.discriminator} (${message.author.id}) issued command too quickly: ${message.content}`)
                            }).catch(console.log);
                        } else {
                            cooldown.add(message.author.id);
                            content = content.slice(command.length).trim();
                            this.logger.info(`${message.author.username}#${message.author.discriminator} (${message.author.id}) issued command: ${message.content}`)
                            const utils = {
                                getRaw: function() {
                                    return message;
                                },
                                getAuthor: function() {
                                    return message.author;
                                },
                                getMember: function() {
                                    return message.member
                                },
                                send: async function (data) {
                                    const msg = message.channel.send(data);
                                    await msg;
                                    return msg;
                                },
                                reply: function(data) {
                                    message.reply(data).then((msg) => {
                                        return msg;
                                    }).catch(console.log);
                                },
                                getArgs: function() {
                                    return args;
                                },
                                getContent: function() {
                                    return content;
                                },

                            }
                            this.commands.emit(command, utils);
                        }
                        setTimeout(() => {
                            //Removes the user from the set after the cooldown.
                            cooldown.delete(message.author.id);
                        }, config.cooldown * 1000);
                    }
                } else {
                    this.emit("message", message);
                }
            } else {
                this.emit("directMessage", message);
            }
        });

        // Role Changes
        client.on("guildMemberUpdate", (oldMember, newMember) => {
            let oldRoles;
            let newRoles;
            newRoles = newMember.roles.cache.map(x => x.id);
            if (oldMember.roles.cache.size < newMember.roles.cache.size) {
                //role added
                oldRoles = oldMember.roles.cache.map(x => x.id);

                const addedRoles = newRoles.filter(function (val) {
                    return (oldRoles.indexOf(val) === -1)
                });
                this.roles.emit("added", newMember, addedRoles);
            } else if (oldMember.roles.cache.size > newMember.roles.cache.size) {
                //role removed

                oldRoles = oldMember.roles.cache.map(x => x.id);
                const removedRoles = oldRoles.filter(function (val) {
                    return (newRoles.indexOf(val) === -1)
                });
                this.roles.emit("removed", newMember, removedRoles);
            }
        });

        // Join/Leave Events
        client.on("guildMemberAdd", (member) => {
            this.logger.info(`${member.user.username}#${member.user.discriminator} (${member.user.id}) joined ${member.guild.name} (${member.guild.id})`);
            this.emit("join", member);
        });
        client.on("guildMemberRemove", (member) => {
            this.logger.info(`${member.user.username}#${member.user.discriminator} (${member.user.id}) left ${member.guild.name} (${member.guild.id})`);
            this.emit("leave", member);
        });
    }
}
module.exports = { Client };


