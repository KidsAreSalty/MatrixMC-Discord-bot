module.exports = class {
	constructor(client) {
		this.client = client;
	}

async run(member) {
  
const Discord = require("discord.js");
  
const db = require("quick.db");
  
  var log = member.guild.channels.find(c => c.name === "welcome");
   
  return log.send(`Goodbye **${member.user.tag}**.`);  

};
};