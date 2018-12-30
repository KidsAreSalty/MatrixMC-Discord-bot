const Discord = require('discord.js');
const config = require("../config.json");
module.exports.run = async (client, message, args) => {	

  let language = require(`../messages/messages_en-US.json`);

  let pingMessage = language["ping"].ping;
  const ping = pingMessage.replace("${ping}", Math.round(client.ping));

  message.channel.send(`${ping}`);
};

module.exports.help = {
  name: 'ping'
}
module.exports.aliases = []