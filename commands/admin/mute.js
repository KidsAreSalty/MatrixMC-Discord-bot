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
  .addField(`🗒 Details`, `**Error:** User has MUTE_MEMBERS`)
  .setTimestamp()
  .setColor("FF4444")
  
  if (!message.member.roles.some(r => ["Staff", "Administration", "Senior Administration", "Head Administration"].includes(r.name)) ) return message.channel.send({embed: permEmbed});
  
  let botEmbed = new Discord.RichEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL)
  .setDescription(`<:error:524068525598572544> **An Error Occured!**`)
  .addField(`🗒 Details`, `**Error:** I am missing permissions\n**Permission:** MUTE_MEMBERS`)
  .setTimestamp()
  .setColor("FF4444")
  
  if (!message.guild.member(client.user).hasPermission("MUTE_MEMBERS")) return message.channel.send({embed: botEmbed}).then(msg => msg.delete(6000))  
  
  let argEmbed = new Discord.RichEmbed()
  .setTitle(`Mute » Admin`)
  .setDescription(`**Steps:** ${prefix}mute [user] [time] [reason]\n**Example(s):** ${prefix}mute @LulzYT#0045 4h flood`)
  .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
  .setColor(color)
  
  if (!args[0]) return message.channel.send({embed: argEmbed});
  
  let user = message.mentions.members.first() || message.guild.members.get(args[0]);
  if (!user) return message.channel.send({embed: argEmbed});
  if (user.id === message.author.id) return;
  if (user.roles.some(r => ["Staff", "Administration", "Senior Administration", "Head Administration"].includes(r.name)) || message.author.id === '260668078369538048') return message.channel.send({embed: userEmbed}).then(p => p.delete(6000));
  if (user.highestRole.position >= message.member.highestRole.position) return message.channel.send("<:error:524068525598572544> » You cannot mute a member with a higher or the same role as you.").then(p => p.delete(6000));
  
  let time = args[1];
  if(!time) return message.channel.send({embed: argEmbed});
  
  let reason = args.slice(2).join(` `);
  if(!reason) return message.channel.send({embed: argEmbed}); 
  
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
  
  if (user.roles.has(role.id)) return message.channel.send("<:error:524068525598572544> » The user provided is already muted!");
  
  await(user.addRole(role.id));
  
  client.users.get(user.id).send(`You have been temporarily muted in ${message.guild.name} for: **${reason}**`, {
    
  }).then(message.channel.send("<:agree:524068507873181696> » **" + user.user.tag + "** has been muted.")).catch(err => {
   console.log(err)
  })
  
  const number = await db.fetch(`caseNum_${user.id}_${message.guild.id}`)
  if (number === null) db.set(`caseNum_${user.id}_${message.guild.id}`, 0)
  db.add(`caseNum_${user.id}_${message.guild.id}`, 1)
  const num = await db.fetch(`caseNum_${user.id}_${message.guild.id}`)
   
  db.set(`case_${user.id}_${message.guild.id}_${num}`, {
    moderator: `${message.author.tag}`,
    reason: reason,
    action: 'Mute',
    user: `(${user.id}) ${user.user.tag}`
  })  
  
  let muteEmbed= new Discord.RichEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL)
  .addField(`User`, user.user.tag, true)
  .setFooter(`Case #${num}`)
  .addField(`Action`, `Mute`, true)
  .addField(`Reason`, reason, true)
  .addField(`Length`, time, true)
  .setColor(color)
  .setTimestamp()
  
   setTimeout(function(){
    user.removeRole(role.id);
  }, ms(time));

   db.fetch(`modChannel_${message.guild.id}`).then(channel => {
   if (!channel) return;
   else if (channel === "none") return;
   let log = message.guild.channels.get(channel)
   
   return log.send({embed: muteEmbed});
   })
}

module.exports.help = {
  name:"mute"
}

module.exports.aliases = []