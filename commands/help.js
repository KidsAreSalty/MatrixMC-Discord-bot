const Discord = require("discord.js");

const config = require("../config.json");

module.exports.run = async (client, message, args) => {

 var color = config.color;
 var prefix = config.prefix;
  
  let embed = new Discord.RichEmbed()
  .setColor(color)
  .setTitle(`\`📜\` Help Is Here \`📜\``)
  .addField(`Commands`, `**${prefix}buy** » Shows you how to get a cad\n**${prefix}website** » View our website! \n**${prefix}uptime** » Shows you the uptime of the bot \n**${prefix}demo** » Shows you the demo cads \n**${prefix}serverinfo** » displays informations about the server \n**${prefix}userinfo @USER** » displays informations about the mentioned user \n**${prefix}scorpion** » displays where to buy Scorpion Cad **ONLY**`)
  
  if (message.member.roles.some(r => ["Staff Trainee", "Staff", "Administration", "Senior Administration", "Head Administration"].includes(r.name)) || message.author.id === '260668078369538048') {  
    embed.addField(`Staff Trainee Commands`, `**${prefix}history** » View a user's mod history\n**${prefix}warn** » Warn a user in the guild`)
  }
  
  if (message.member.roles.some(r => ["Staff", "Administration", "Senior Administration", "Head Administration"].includes(r.name)) || message.author.id === '260668078369538048') {
    embed.addField(`Staff Commands`, `**${prefix}ban** » Ban a user from the guild.\n**${prefix}kick** » Kick a guild member\n**${prefix}mute** » Temp mute a user from all chats
    **${prefix}warn** » Warn a given member \n**${prefix}probation** » Gives a user probation for 2 Weeks`)
  }
  
if (message.member.roles.some(r => ["Administration", "Senior Administration", "Head Administration"].includes(r.name)) || message.author.id === '260668078369538048') {
    embed.addField(`Administration and Up Commands`, `**${prefix}ban** » Ban a user from the guild.\n**${prefix}clearhistory** » Clear a user's mod history\n**${prefix}history** » View a user's mod history
    **${prefix}kick** » Kick a guild member\n**${prefix}logchannel** » Set a server logging channel\n**${prefix}modlogs** » Set a mod log channel\n**${prefix}mute** » Temp mute a user from all chats
    **${prefix}mutechat** » Mute the current text channel\n**${prefix}purge** » Clear messages!\n**${prefix}unmute** » Unmute a muted user\n**${prefix}delcase** » Delete a chosen case
    **${prefix}warn** » Warn a given member`)
  }
  
  return message.channel.send({embed: embed})
  
}

module.exports.help = {
  name:"help"
}

module.exports.aliases = []