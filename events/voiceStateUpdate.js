module.exports = class {
	constructor(client) {
		this.client = client;
	}

async run(oldMember, newMember) {
  
const Discord = require("discord.js");
  
const db = require("quick.db");

const config = require("../config.json");
  
 var color = config.color;
  
 let newChannel = newMember.voiceChannel;
 let oldChannel = oldMember.voiceChannel;
  
 db.fetch(`logChannel_${newMember.guild.id}`).then(channel => {
 if (!channel) return;
 else if (channel === "none") return;
 let log = newMember.guild.channels.get(channel)
   
  if (oldChannel === undefined && newChannel !== undefined) {

   let joinEmbed = new Discord.RichEmbed()
   .setColor(color)
   .setTimestamp()
   .setAuthor(newMember.user.username, newMember.user.displayAvatarURL)
   .setDescription(`${newMember} **joined voice channel**\n${newChannel}`)
   .setFooter(`ID: ${newMember.user.id}`)
   
   return log.send({embed: joinEmbed});

  } else {
    
  if (newChannel === undefined) {

   let leaveEmbed = new Discord.RichEmbed()
   .setColor(color)
   .setTimestamp()
   .setAuthor(newMember.user.username, newMember.user.displayAvatarURL)
   .setDescription(`${newMember} **left voice channel**\n${oldChannel}`)
   .setFooter(`ID: ${newMember.user.id}`)
    
   return log.send({embed: leaveEmbed});
  }
  } 
 });  

};
};