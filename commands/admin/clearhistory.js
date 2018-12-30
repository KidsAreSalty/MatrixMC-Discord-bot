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

  if (!message.member.roles.some(r => ["Administration", "Senior Administration", "Head Administration"].includes(r.name)) ) return message.channel.send({embed: permEmbed});
  
  let argEmbed = new Discord.RichEmbed()
  .setColor(color)
  .setTitle("Clearhistory » Admin")
  .setDescription("**Usage:** "+ prefix +"clearhistory [user]\n**Example(s)**: "+ prefix +"clearhistory @LulzYT#0045");
  
  let user = message.mentions.members.first() || message.guild.members.get(args[0]);
  if (!user) return message.channel.send({embed: argEmbed});  
  
  let cases = await db.startsWith(`case_${user.id}_${message.guild.id}`);
  for (var i in cases) {
    db.delete(`case_${user.id}_${message.guild.id}_${cases[i].ID.split("_")[3]}`)
  }
  
  let warns = await db.startsWith(`warns_${user.id}_${message.guild.id}`);
  for (var i in cases) {
    db.delete(`case_${user.id}_${message.guild.id}_${cases[i].ID.split("_")[3]}`)
  }
  
  if (!cases && !warns) return message.channel.send(`<:error:524068525598572544> » No logs found for **${user.user.username}**`);

  db.delete(`caseNum_${user.id}_${message.guild.id}`);
  db.delete(`warnNum_${user.id}_${message.guild.id}`);
  return message.channel.send(`<:agree:524068507873181696> » User's modlogs have been reset completely!`)  
  
}

module.exports.help = {
  name:"clearhistory"
}

module.exports.aliases = []