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
  .setTitle(`Purge » Admin`)
  .setDescription(`**Steps:** ${prefix}purge [amount]\n**Example(s):** ${prefix}purge 50`)
  .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
  .setColor(color)
  
  if (!args[0]) return message.channel.send({embed: argEmbed});  
  
  let amount = Number(args[0]);
  if (amount > 100) { amount = 100 };
  
  try {
    
    let messages = await message.channel.fetchMessages({ limit: amount });
    
    if (amount) {
      
    await message.channel.bulkDelete(messages)
    await message.channel.send("<:agree:524068507873181696> » I've deleted **" + amount + "** messages").then(msg => msg.delete(2000));
  
    db.fetch(`modChannel_${message.guild.id}`).then(channel => {
    if (!channel) return;
    else if (channel === "none") return;
    let log = message.guild.channels.get(channel)  
      
    let purgeEmbed= new Discord.RichEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL)
    .addField(`Action`, `Purge`, true)
    .addField(`Moderator`, message.author.tag + ` (${message.author.id})`, true)
    .addField(`Amount`, amount, true)
    .addField(`Channel`, message.channel, true)
    .setColor(color)
    .setTimestamp()    
    
    return log.send({embed: purgeEmbed})
    })
    }    
   } catch (e) {
   console.log('Error', e) 
  }
  
}

module.exports.help = {
  name:"purge"
}

module.exports.aliases = ["clear"]