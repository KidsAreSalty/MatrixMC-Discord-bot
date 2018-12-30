module.exports = class {
	constructor(client) {
		this.client = client;
	}

async run() {
  
const Discord = require("discord.js");

const config = require("../config.json");
  
//Set a status with the following options » [dnd, online, idle, offline]
var status = config.status;
  
  this.client.user.setStatus(status);
  this.client.user.setActivity("on IP |?help", {
  "type": "STREAMING",
  "url": "https://www.twitch.tv/IPLCC"
  });
  
  console.log(``);
  console.log(`Settings have been set!`);
  console.log(`${this.client.users.size} Users`);
  console.log(`${this.client.channels.size} Channels`);
  console.log(`${this.client.guilds.size} Servers`);
  console.log(``);
  console.log(`      • ${this.client.user.tag} •      `)
  console.log("       Cruise™ Production      ")

 };
};