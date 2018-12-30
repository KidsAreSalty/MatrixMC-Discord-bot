module.exports = class {
	constructor(client) {
		this.client = client;
	}

async run(oldMessage, newMessage) {
  
const Discord = require("discord.js");
  
const db = require("quick.db");

const config = require("../config.json");
  
 var color = config.color;
 if (newMessage.author.bot) return;
 db.fetch(`logChannel_${newMessage.guild.id}`).then(channel => {
 if (!channel) return;
 else if (channel === "none") return;
 let log = newMessage.guild.channels.get(channel)
   
 if (oldMessage.content !== undefined || newMessage.content !== undefined) {
 
   let updateEmbed = new Discord.RichEmbed()
   .setColor(color)
   .setAuthor(newMessage.author.tag, newMessage.author.displayAvatarURL)
   .setDescription(`**Message Edited in ${newMessage.channel}**`)
   .addField(`Before`, `${oldMessage.content}`)
   .addField(`After`, `${newMessage.content}`)   
   .setTimestamp()
   
   return log.send({embed: updateEmbed});
 }
 });  

};
};