const Discord = require("discord.js");

const db = require("quick.db");

const config = require("../../config.json");

module.exports.run = async (client, message, args) => {

 var color = config.color;
 var prefix = config.prefix;
  
 message.delete();
  
  let permEmbed = new Discord.RichEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL)
  .setDescription(`<:error:524068525598572544> **An Error Occured!**`)
  .addField(`🗒 Details`, `**Error:** You are missing permissions`)
  .setTimestamp()
  .setColor("FF4444")
  
  if (!message.member.roles.some(r => ["Administration", "Senior Administration", "Head Administration"].includes(r.name)) ) return message.channel.send({embed: permEmbed}); 

  db.fetch(`chat_${message.guild.id}`).then(channel => {
  
    if (!channel || channel === null) {
     message.channel.overwritePermissions(message.guild.roles.get(message.guild.id), {
       SEND_MESSAGES: false
     })
    db.set(`chat_${message.guild.id}`, "active");
    return message.channel.send("<:agree:524068507873181696> » **Channel has been locked!**");
      
    } else { 

     message.channel.overwritePermissions(message.guild.roles.get(message.guild.id), {
       SEND_MESSAGES: null
     })
    db.set(`chat_${message.chanel.id}`, null) 
    return message.channel.send("<:agree:524068507873181696> » Text channel **Unmuted**!");
    }
  });
  
}

module.exports.help = {
  name:"mutechat"
}

module.exports.aliases = []