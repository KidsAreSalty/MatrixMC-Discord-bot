const Discord = require("discord.js");

const config = require("../../config.json");

module.exports.run = async (client, message, args) => {

 var color = config.color;

 if (message.author.id !== '260668078369538048') return;
  
 message.channel.send("<a:loading:453298928054697984> » Packing my bags!")
  
 process.exit(1);
  
}

module.exports.help = {
  name:"restart"
}

module.exports.aliases = []