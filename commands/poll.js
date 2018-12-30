const Discord = require("discord.js")
const config = require("../config.json");
 var color = config.color;
 var prefix = config.prefix;
module.exports.run = async(bot, message, arg, arg1, arg2, arg3, config) => {


    let botme = message.guild.me
    const pollusage = new Discord.RichEmbed()
        .setTitle("Purge Usage")
        .setColor(color)
        .setDescription(`Usage of suggest command: ${prefix}poll [Question 1] [Question 2] (Question 3)\nExample: ${prefix}poll | `)
        const needpollchannel = new Discord.RichEmbed()
        .setTitle("❌ ERROR ❌")
        .setColor(color)
        .setDescription("It seems like that this server doesn't have the channel ``polls``.\nPlease create this channel and try again!")

                        let specialargs = message.content.split('|').slice(1, 2).join('\n');
                        let specialargs1 = message.content.split('|').slice(2, 3)
                        let specialargs2 = message.content.split('|').slice(3, 4)
                        if (message.member.hasPermission("MANAGE_MESSAGES")) {
                          if (message.guild.channels.find("name", "polls")) {
                            if (specialargs) {
                                if (specialargs1) {
                                    if (specialargs2) {
                                        message.delete(1)
                                        message.guild.channels.find("name", "polls").send({
                                            embed: {
                                                color: color,
                                                fields: [{
                                                    name: specialargs,
                                                    value: "🇦 " + specialargs1 + "\n🇧 " + specialargs2
                                                }, ],
                                                timestamp: new Date(),
                                                footer: {
                                                    icon_url: message.author.avatarURL,
                                                    text: ' Poll by ' + message.author.tag
                                                }
                                            }
                                        }).then(function(message) {
                                            message.react("🇦")
                                            message.react("🇧")
                                            message.guild.channels.find("name", "polls").send("@here")
                                        });
                                        let pollchannel = message.guild.channels.find("name", "polls")
                                        console.log(`\nPoll Created:\n- Question: ${specialargs}\n- Option 1: ${specialargs1}\n- Option 2: ${specialargs2}`)
                                        message.channel.send(`:ballot_box_with_check: The poll has been posted in <#${pollchannel.id}>`).then(m => m.delete(20000))
                                    } else {
                                        message.channel.send("``You need to set a second option! " + prefix + "poll | <question> | <option 1> | <option 2> |``").then(m => m.delete(20000))
                                    }
                                } else {
                                    message.channel.send("``You need to set the options! " + prefix + "poll | <question> | <option 1> | <option 2> |``").then(m => m.delete(20000))
                                }
                            } else {
                                message.channel.send("``Correct Usage: " + prefix + "poll | <question> | <option 1> | <option 2> |``").then(m => m.delete(20000))
                        }
                      } else {
                        message.delete(1)
                        message.channel.send(needpollchannel).then(m => m.delete(20000))
                      }
                    } else {
                            message.react("❌")
                    }
                }

    

module.exports.help = {
    name: "poll"
}

module.exports.aliases = []