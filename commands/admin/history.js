const Discord = require("discord.js");

const db = require("quick.db");

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

  if (!message.member.roles.some(r => ["Staff Trainee", "Staff", "Administration", "Senior Administration", "Head Administration"].includes(r.name)) ) return message.channel.send({embed: permEmbed}); 
  
  let argEmbed = new Discord.RichEmbed()
  .setColor(color)
  .setTitle("History » Admin")
  .setDescription("**Usage:** "+ prefix +"history [user]\n**Example(s)**: "+ prefix +"history @LulzYT#0045");
  
  let user = message.mentions.members.first() || message.guild.members.get(args[0]);
  if (!user) return message.channel.send({embed: argEmbed});  
 
  let msg = ''

  let resp = await db.startsWith(`case_${user.id}_${message.guild.id}`)
    
  for (var i in resp) {  
  
    let caseNum = resp[i].ID.split("_")[3]
    let action = await db.fetch(`case_${user.id}_${message.guild.id}_${caseNum}`, {
     target: '.action'
    })
    let moderator = await db.fetch(`case_${user.id}_${message.guild.id}_${caseNum}`, {
     target: '.moderator'
    })
    let reason = await db.fetch(`case_${user.id}_${message.guild.id}_${caseNum}`, {
     target: '.reason'
    })
    let member = await db.fetch(`case_${user.id}_${message.guild.id}_${caseNum}`, {
     target: '.user'
    })  
    
    msg += `**Case ${caseNum}**\n**Type:** ${action}\n**User:** ${member}\n**Moderator:** ${moderator}\n**Reason:** ${reason}\n`
  }
  if (msg.length === 0) return message.channel.send(`<:error:524068525598572544> » No logs found for **${user.user.tag}**`)
  
  let embed = new Discord.RichEmbed()
  .setColor(color)
  .setDescription(`${msg}`)
  .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
        
  await message.channel.send({embed: embed})  
  
}

module.exports.help = {
  name:"history"
}

module.exports.aliases = []