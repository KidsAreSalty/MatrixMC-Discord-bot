module.exports = class {
	constructor(client) {
		this.client = client;
	}

async run(message) {
  
const Discord = require("discord.js");
const queue = new Map();

const config = require("../config.json");
  
 var prefix = config.prefix;
  
 if(message.author.bot) return;
 if(message.channel.type === "dm") return;
  
  if(!message.content.startsWith(prefix)) return;
  let messageArray = message.content.split(/\s+/g);
  let command = messageArray[0];
  let args = messageArray.slice(1);

  if(!command.startsWith(prefix)) return;
  
    if (this.client.aliases.has(command.slice(prefix.length).toLowerCase())) {
      this.client.commands.get(this.client.aliases.get(command.slice(prefix.length).toLowerCase())).run(this.client, message, args, queue)
    }
        
    if (this.client.commands.has(command.slice(prefix.length).toLowerCase())) {
      this.client.commands.get(command.slice(prefix.length).toLowerCase()).run(this.client, message, args, queue)
    }  

};
};