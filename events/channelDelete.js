module.exports = class {
	constructor(client) {
		this.client = client;
	}

async run(channel) {
  
const Discord = require("discord.js");
  
const db = require("quick.db");

const config = require("../config.json");
  
 var color = config.color;
  
 db.fetch(`logChannel_${channel.guild.id}`).then(c => {
 if (!c) return;
 else if (c === "none") return;
 let log = channel.guild.channels.get(c)
   
  let deleteChannel = new Discord.RichEmbed()
  .setColor(color)
  .setTimestamp()
  .setAuthor(channel.guild.name, channel.guild.displayAvatarURL)
  .setDescription(`**Channel Deleted: ${channel.name}**`)
  .setFooter(`ID: ${channel.id}`)
  
  return log.send({embed: deleteChannel});

 });  

};
};