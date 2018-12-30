module.exports = class {
	constructor(client) {
		this.client = client;
	}

async run(oldRole, newRole) {
  
const Discord = require("discord.js");
  
const db = require("quick.db");

const config = require("../config.json");
  
 var color = config.color;
  
 db.fetch(`logChannel_${newRole.guild.id}`).then(channel => {
 if (!channel) return;
 else if (channel === "none") return;
 let log = newRole.guild.channels.get(channel)
   
  let updateRole = new Discord.RichEmbed()
  .setColor(color)
  .setAuthor(newRole.guild.name, newRole.guild.displayAvatarURL)
  .setDescription(`**Role Updated: ${newRole.name}**`)
  
  return log.send({embed: updateRole});

 });  

};
};