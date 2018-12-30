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
  
  let botEmbed = new Discord.RichEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL)
  .setDescription(`<:error:524068525598572544> **An Error Occured!**`)
  .addField(`🗒 Details`, `**Error:** I am missing permissions\n**Permission:** MANAGE_ROLES`)
  .setTimestamp()
  .setColor("FF4444")
  
  if (!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) return message.channel.send({embed: botEmbed}).then(msg => msg.delete(6000))  
  
  let argEmbed = new Discord.RichEmbed()
  .setTitle(`Unmute » Admin`)
  .setDescription(`**Steps:** ${prefix}Unmute [user] [reason]\n**Example(s):** ${prefix}Unmute @LulzYT#0045`)
  .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
  .setColor(color)
  
  if (!args[0]) return message.channel.send({embed: argEmbed});
  
  let user = message.mentions.members.first() || message.guild.members.get(args[0]);
  if (!user) return message.channel.send({embed: argEmbed});
  if (user.id === message.author.id) return;
  
  let time = args[1];
  if(!time) return message.channel.send({embed: argEmbed});
  
  let reason = args.slice(1).join(` `); 
  if(!reason) { reason = "No Reason Provided" };
  
  let role = message.guild.roles.find(`name`, "Muted");
   if(!role){
     try{
       role = await message.guild.createRole({
         name: "Muted",
         color: "#000000",
         permissions: []
       })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(role, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  
  if (!user.roles.has(role.id)) return message.channel.send("<:error:524068525598572544> » " + user.user.tag + " is not muted.");
  
  await(user.removeRole(role.id));
  
  message.channel.send("<:agree:524068507873181696> » **" + user.user.tag + "** has been unmuted.");
  
  const number = await db.fetch(`caseNum_${user.id}_${message.guild.id}`)
  if (number === null) db.set(`caseNum_${user.id}_${message.guild.id}`, 0)
  db.add(`caseNum_${user.id}_${message.guild.id}`, 1)
  const num = await db.fetch(`caseNum_${user.id}_${message.guild.id}`)
   
  db.set(`case_${user.id}_${message.guild.id}_${num}`, {
    moderator: `${message.author.tag}`,
    reason: reason,
    action: 'Unmute',
    user: `(${user.id}) ${user.user.tag}`
  })  
  
  let unmuteEmbed= new Discord.RichEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL)
  .addField(`User`, user.user.tag, true)
  .addField(`Action`, `Unmute`, true)
  .addField(`Reason`, reason, true)
  .setFooter(`Case #${num}`)
  .setColor(color)
  .setTimestamp()
  
   db.fetch(`modChannel_${message.guild.id}`).then(channel => {
   if (!channel) return;
   else if (channel === "none") return;
   let log = message.guild.channels.get(channel)
   
   return log.send({embed: unmuteEmbed});
   });
  
}

module.exports.help = {
  name:"unmute"
}

module.exports.aliases = []