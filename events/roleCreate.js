module.exports = class {
	constructor(client) {
		this.client = client;
	}

async run(role) {
  
const Discord = require("discord.js");
  
const db = require("quick.db");

const config = require("../config.json");
  
 var color = config.color;
  
 db.fetch(`logChannel_${role.guild.id}`).then(channel => {
 if (!channel) return;
 else if (channel === "none") return;
 let log = role.guild.channels.get(channel)
   
  let createRole = new Discord.RichEmbed()
  .setColor(color)
  .setAuthor(role.guild.name, role.guild.displayAvatarURL)
  .setDescription(`**Role Created: ${role.name}**`)
  
  return log.send({embed: createRole});

 });  

};
};