const Discord = require("discord.js");

const config = require("../config.json");

module.exports.run = async (client, message, args) => {

 var color = config.color;
  
 let embed = new Discord.RichEmbed()
 .setTitle("How to Buy")
 .setColor(color)
 .setDescription("Please Go to <#523468974470725632> or type ?demo And see what cad you would like to buy then go to <#523274499764912129> And do -new cad request")
 .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
 
 return message.channel.send({embed: embed});
  
}

module.exports.help = {
  name:"buy"
}

module.exports.aliases = []