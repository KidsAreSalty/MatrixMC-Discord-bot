const Discord = require("discord.js");

const config = require("../config.json");

module.exports.run = async (client, message, args) => {

 var color = config.color;
  
 let embed = new Discord.RichEmbed()
 .setColor(color)
 .setDescription("[\`Infusion Productions LLC\`](https://infusion-productions.ml/)")
 .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
 
 return message.channel.send({embed: embed});
  
}

module.exports.help = {
  name:"website"
}

module.exports.aliases = ["site", "link"]