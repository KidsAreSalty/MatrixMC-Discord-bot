module.exports = class {
	constructor(client) {
		this.client = client;
	}

async run(member) { 
  
const Discord = require("discord.js");
  
const db = require("quick.db");

  var log = member.guild.channels.find(c => c.name === "welcome");
   
  log.send(`Welcome to **${member.guild.name} ${member.user.tag}**, please read <#523287894266478612>.`)
   
  member.addRole(member.guild.roles.find('name', 'Member'));  

};

};