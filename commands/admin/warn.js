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
  
  if (!message.member.roles.some(r => ["Staff Trainee", "Staff", "Administration", "Senior Administration", "Head Administration"].includes(r.name)) ) return  message.channel.send({embed: permEmbed}); 
  
  let argEmbed = new Discord.RichEmbed()
  .setTitle(`Warn » Admin`)
  .setDescription(`**Steps:** ${prefix}warn [user] [reason]\n**Example(s):** ${prefix}Warn @LulzYT#0045 profanity`)
  .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
  .setColor(color)
  
  if (!args[0]) return message.channel.send({embed: argEmbed});  
  
  let user = message.mentions.members.first() || message.guild.members.get(args[0]);
  if (user.roles.some(r => ["Staff Trainee", "Staff", "Administration", "Senior Administration", "Head Administration"].includes(r.name)) ) return message.channel.send({embed: permEmbed});
  if (user.id === message.author.id) return;
  if (!user) return message.channel.send({embed: argEmbed});
  
  let reason = args.slice(1).join(` `)
  if (!reason) return message.channel.send({embed: argEmbed});
  
  client.users.get(user.id).send(`You have been warned in ${message.guild.name} for: **${reason}**`, {
     
  }).then(message.channel.send("<:agree:524068507873181696> » ***" + user.user.tag + " has been warned!***")).catch(err => {
    return message.channel.send("<:error:524068525598572544> » Unable to complete the warn. **" + user.user.tag + "** has direct messages disabled.");
  })
  
  let warnNum = await db.fetch(`warnNum_${user.id}_${message.guild.id}`)
  if (warnNum === null) db.set(`warnNum_${user.id}_${message.guild.id}`, 0)
  db.add(`warnNum_${user.id}_${message.guild.id}`, 1)
  let warnNumber = await db.fetch(`warnNum_${user.id}_${message.guild.id}`)

  db.set(`warns_${user.id}_${message.guild.id}_${warnNumber}`, reason)

  const number = await db.fetch(`caseNum_${user.id}_${message.guild.id}`)
  if (number === null) db.set(`caseNum_${user.id}_${message.guild.id}`, 0)
  db.add(`caseNum_${user.id}_${message.guild.id}`, 1)
  const num = await db.fetch(`caseNum_${user.id}_${message.guild.id}`)
  db.set(`case_${user.id}_${message.guild.id}_${num}`, {
   moderator: message.author.tag,
   user: `(${user.id}) ${user.user.tag}`,
   reason: reason,
   action: 'Warn'
  })
 
  let warnEmbed= new Discord.RichEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL)
  .addField(`User`, user.user.tag, true)
  .addField(`Action`, `Warn`, true)
  .addField(`Reason`, reason, true)
  .setFooter(`Case #${num}`)
  .setColor(color)
  .setTimestamp()
  
   db.fetch(`modChannel_${message.guild.id}`).then(channel => {
   if (!channel) return;
   else if (channel === "none") return;
   let log = message.guild.channels.get(channel)
   
   return log.send({embed: warnEmbed});
   });  
  
}

module.exports.help = {
  name:"warn"
}

module.exports.aliases = []