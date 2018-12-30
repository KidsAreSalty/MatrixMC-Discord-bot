const Discord = require('discord.js');
const config = require("../config.json");
const moment = require('moment');
 var color = config.color;
module.exports.run = async (client, message, args) => {	
  if(!message.guild.available) {
    return;
  }
     let i = 0;
     message.guild.members.map(member => {
       if(!member.user.bot) i++;
     });

     let b = 0;
     message.guild.members.map(member => {
       if(member.user.bot) b++;
     });

     let o = 0;
     message.guild.members.map(member => {
       if(member.user.presence.status === 'online' || member.user.presence.status === 'away' || member.user.presence.status === 'dnd') o++;
     });

     let text = 0;
     message.guild.channels.map(channel => {
       if(channel.type === "text") text++;
     });

     let voice = 0;
     message.guild.channels.map(channel => {
       if(channel.type === "voice") voice++;
     });

     let chan = 0;
     message.guild.channels.map(channel => {
       if(channel.type === "voice" || channel.type === "text") chan++;
     });

     let cat = 0;
     message.guild.channels.map(channel => {
       if(channel.type === "category") cat++;
     });

     const guildIcon = "https://cdn.discordapp.com/icons/" + message.guild.id + "/" + message.guild.icon + ".webp" || "https://media.discordapp.net/attachments/492508450207825920/510859900512108574/MOCKUP_31Jul18_1947_B57670.png?width=300&height=300";
     
    const embed = new Discord.RichEmbed()
    .setColor("0000FF")
    .setAuthor(message.guild.name, guildIcon)
    .setThumbnail(guildIcon)
    .addField("Members", `Humans: ${i}\nRobots: ${b}\nOnline: ${o}\nTotal: ${message.guild.members.size}`, true)
    .addField("Owner", `Tag: ${message.guild.owner.user.tag}\nID: ${message.guild.owner.user.id}\nWhat they're playing: ${message.guild.owner.user.presence.game ? message.guild.owner.user.presence.game.name : 'None'}\nStatus: ${message.guild.owner.user.presence.status}`, true)
    .addField("Channels", chan, true)
    .addField("Voice Channels", voice, true)
    .addField("Text Channels", text, true)
    .addField("Categories", cat, true)
    .addField(`Region`, `${message.guild.region}`, true)
    .addField("Roles", message.guild.roles.size, true)
    .addField(`Created at:`, `${moment.utc(message.guild.createdAt).format('LLLL')}`, true)
    .setTimestamp()
    .setFooter("ID: " + message.guild.id, guildIcon)

    if(!message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS')) {
      message.channel.send(":x: **| I need the `EMBED_LINKS` permission to this command to work.**");
      return;
    };

 return message.channel.send({embed: embed});
  
}

module.exports.help = {
  name: 'serverinfo'
}
module.exports.aliases = []