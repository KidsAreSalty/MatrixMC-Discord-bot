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
  
  if (!message.member.roles.some(r => ["Staff", "Administration", "Senior Administration", "Head Administration"].includes(r.name)) ) return message.channel.send({embed: permEmbed});

  let botEmbed = new Discord.RichEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL)
  .setDescription(`<:error:524068525598572544> **An Error Occured!**`)
  .addField(`🗒 Details`, `**Error:** I am missing permissions\n**Permission:** BAN_MEMBERS`)
  .setTimestamp()
  .setColor("FF4444")
  
  if (!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) return message.channel.send({embed: botEmbed}).then(msg => msg.delete(6000))  
  
  let argEmbed = new Discord.RichEmbed()
  .setTitle(`Ban » Admin`)
  .setDescription(`**Steps:** ${prefix}ban [user] [reason]\n**Aliases:** ${prefix}b\n**Example(s):** ${prefix}ban @LulzYT#0045 rule#1`)
  .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
  .setColor(color)
  
  if (!args[0]) return message.channel.send({embed: argEmbed});
  
  var user = message.mentions.members.first() || message.guild.members.get(args[0]);
  if (!user) return message.channel.send({embed: argEmbed});
  if(user.roles.some(r => ["Staff", "Administration", "Senior Administration", "Head Administration"].includes(r.name)) ) return message.channel.send({embed: permEmbed}).then(msg => msg.delete(6000))
  if (user.id === message.author.id) return;
  let reason = args.slice(1).join(` `); 
  if (!reason) return message.channel.send({embed: argEmbed});
  
  message.guild.member(user).ban(reason);
  
  client.users.get(user.id).send(`You have been banned from ${message.guild.name} for the following reason: **${reason}**`, {
    
  }).then(message.channel.send("<:agree:524068507873181696> » "+ user.user.tag +" has been banned")).catch(err => {
      console.log(err)
  })
  
  const number = await db.fetch(`caseNum_${user.id}_${message.guild.id}`)
  if (number === null) db.set(`caseNum_${user.id}_${message.guild.id}`, 0)
  db.add(`caseNum_${user.id}_${message.guild.id}`, 1)
  const num = await db.fetch(`caseNum_${user.id}_${message.guild.id}`)
  
  db.set(`case_${user.id}_${message.guild.id}_${num}`, {
    moderator: `${message.author.tag}`,
    reason: reason,
    action: 'Ban',
    user: `(${user.id}) ${user.user.tag}`
  })
  
  let banEmbed = new Discord.RichEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL)
  .addField(`User`, user.user.tag, true)
  .addField(`Action`, `Ban`, true)
  .addField(`Reason`, reason, true)
  .setFooter(`Case #${num}`)
  .setColor(color)
  .setTimestamp()
  
   db.fetch(`modChannel_${message.guild.id}`).then(channel => {
   if (!channel) return;
   else if (channel === "none") return;
   let log = message.guild.channels.get(channel)
   
   return log.send({embed: banEmbed});
   });
  
}

module.exports.help = {
  name:"ban"
}

module.exports.aliases = ["b"]