const Discord = require("discord.js");

const db = require("quick.db");
const moment = require('moment');

const config = require("../../config.json");

module.exports.run = async (client, message, args) => {

 var color = config.color;
 var prefix = config.prefix;
  
  let permEmbed = new Discord.RichEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL)
  .setDescription(`<:error:524068525598572544> **An Error Occured!**`)
  .addField(`🗒 Details`, `**Error:** You are missing permissions`)
  .setTimestamp()
  .setColor("FF4444") 
  
  if (!message.member.roles.some(r => ["Administration", "Senior Administration", "Head Administration"].includes(r.name)) ) return message.channel.send({embed: permEmbed});

  let argEmbed = new Discord.RichEmbed()
  .setTitle(`Modlogs » Admin`)
  .setDescription(`**Steps:** ${prefix}modlogs [channel]\n**Example(s):** ${prefix}modlogs none`)
  .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
  .setColor(color)
  
  if (!args[0]) return message.channel.send({embed: argEmbed}); 
  
  let channel = '';
  if (args.join(" ").toLowerCase() === 'none') {

   message.channel.send(`<:agree:524068507873181696> » Successfully removed the mod logging channel`)
      
   return db.set(`modChannel_${message.guild.id}`, "none");
      
  }
  
   else channel = message.mentions.channels.first().id;

   db.set(`modChannel_${message.guild.id}`, channel).then(i => {
     
   let embed = new Discord.RichEmbed()
   .setColor(color)
   .setAuthor(message.author.tag, message.author.displayAvatarURL)
   .setDescription(`<:agree:524068507873181696> » Mod logs has been set to: ${message.mentions.channels.first()}`)
   .setFooter(moment().format('MMMM Do YYYY, h:mm:ss a'))
 
   return message.channel.send({embed: embed})
  
  })  
  
}

module.exports.help = {
  name:"modlogs"
}

module.exports.aliases = []