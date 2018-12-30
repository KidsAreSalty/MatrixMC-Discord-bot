const Discord = require("discord.js");

const db = require("quick.db");
const ms = require("ms");

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
  
  let userEmbed = new Discord.RichEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL)
  .setDescription(`<:error:524068525598572544> **An Error Occured!**`)
  .addField(`🗒 Details`, `**Error:** User has KICK_MEMBERS`)
  .setTimestamp()
  .setColor("FF4444")
  
  if (!message.member.roles.some(r => ["Administration", "Senior Administration", "Head Administration"].includes(r.name))) return message.channel.send({embed: permEmbed});
  
  let botEmbed = new Discord.RichEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL)
  .setDescription(`<:error:524068525598572544> **An Error Occured!**`)
  .addField(`🗒 Details`, `**Error:** I am missing permissions\n**Permission:** KICK_MEMBERS`)
  .setTimestamp()
  .setColor("FF4444")
  
  if (!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) return message.channel.send({embed: botEmbed}).then(msg => msg.delete(6000))  
  
  let argEmbed = new Discord.RichEmbed()
  .setTitle(`Vckick » Admin`)
  .setDescription(`**Steps:** ${prefix}vckick [user] [reason]\n**Example(s):** ${prefix}vckick @regrets#7267 flood`)
  .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
  .setColor(color)
  
  if (!args[0]) return message.channel.send({embed: argEmbed});
  
  let user = message.mentions.members.first() || message.guild.members.get(args[0]);
  if (!user) return message.channel.send({embed: argEmbed});
  if (user.id === message.author.id) return;
  if (user.roles.some(r => ["Administration", "Senior Administration", "Head Administration"].includes(r.name))) return message.channel.send({embed: userEmbed}).then(p => p.delete(6000));
  if (user.highestRole.position >= message.member.highestRole.position) return message.channel.send("<:error:524068525598572544> » You cannot kick a member with a higher or the same role as you.").then(p => p.delete(6000));
  
  let reason = args.slice(1).join(` `);
  if(!reason) return message.channel.send({embed: argEmbed}); 
  
  if (!user.voiceChannel) return message.channel.send("<:error:524068525598572544> » This user is not in a voice channel!")
  
  message.guild.createChannel(`temp channel`, 'voice', [{
   id: message.guild.id,  
   deny: ['READ_MESSAGES']
  }]).then(async function (channel) {
        
    await user.setVoiceChannel(channel);
    await channel.delete();
    
  })
  
  message.channel.send("<:agree:524068507873181696> » **" + user.user.tag + "** has been Voice chat kicked.");
  
  const number = await db.fetch(`caseNum_${user.id}_${message.guild.id}`)
  if (number === null) db.set(`caseNum_${user.id}_${message.guild.id}`, 0)
  db.add(`caseNum_${user.id}_${message.guild.id}`, 1)
  const num = await db.fetch(`caseNum_${user.id}_${message.guild.id}`)
   
  db.set(`case_${user.id}_${message.guild.id}_${num}`, {
    moderator: `${message.author.tag}`,
    reason: reason,
    action: 'Vckick',
    user: `(${user.id}) ${user.user.tag}`
  })  
  
  let kickEmbed= new Discord.RichEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL)
  .addField(`User`, user.user.tag, true)
  .setFooter(`Case #${num}`)
  .addField(`Action`, `Vckick`, true)
  .addField(`Reason`, reason, true)
  .setColor(color)
  .setTimestamp()

   db.fetch(`modChannel_${message.guild.id}`).then(channel => {
   if (!channel) return;
   else if (channel === "none") return;
   let log = message.guild.channels.get(channel)
   
   return log.send({embed: kickEmbed});
   })
}

module.exports.help = {
  name:"vckick"
}

module.exports.aliases = []