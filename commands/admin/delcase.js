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
  
  let argEmbed = new Discord.RichEmbed()
  .setTitle(`Delcase » Admin`)
  .setDescription(`**Steps:** ${prefix}delcase [user] [case #]\n**Example(s):** ${prefix}delcase @LulzYT#0045 4`)
  .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
  .setColor(color)
  
  if (!args[0]) return message.channel.send({embed: argEmbed});  
  
  let user = message.mentions.members.first() || message.guild.members.get(args[0]);
  if (user.id === message.author.id) return;
  if (!user) return message.channel.send({embed: argEmbed});
  
  let num = await db.fetch(`case_${user.id}_${message.guild.id}_${args[1]}`);
  if (!num) return message.channel.send({embed: argEmbed});
  
  db.delete(`case_${user.id}_${message.guild.id}_${args[1]}`)
  
  return message.channel.send("<:agree:524068507873181696> » **"+ user.user.username +"'s** case has been removed!");
}

module.exports.help = {
  name:"delcase"
}

module.exports.aliases = []