module.exports = class {
	constructor(client) {
		this.client = client;
	}

async run(message) {
  
const Discord = require("discord.js");
  
const db = require("quick.db");

const config = require("../config.json");
  
 var color = config.color;
  
 db.fetch(`logChannel_${message.guild.id}`).then(channel => {
 if (!channel) return;
 else if (channel === "none") return;
 let log = message.guild.channels.get(channel)
   
   let deleteEmbed = new Discord.RichEmbed()
   .setColor(color)
   .setAuthor(message.author.tag, message.author.displayAvatarURL)
   .setDescription(`**Messaeg sent by ${message.author}** deleted in ${message.channel}\n${message.content}`)
   .setTimestamp()
   
   return log.send({embed: deleteEmbed});
 });  

};
};