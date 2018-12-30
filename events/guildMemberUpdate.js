module.exports = class {
    constructor(client) {
        this.client = client;
    }

async run(oldMember, newMember) {
  
const Discord = require("discord.js");
  
const db = require("quick.db");

const config = require("../config.json");
  
 var color = config.color;
  
 db.fetch(`logChannel_${newMember.guild.id}`).then(c => {
 if (!c) return;
 else if (c === "none") return;
 let log = newMember.guild.channels.get(c)
 
 if (newMember.nickname !== oldMember.nickname) {
 
  let nUser = newMember.nickname;
  let oUser = oldMember.nickname;
   
  if (oUser === null) { oUser = "None" }
  if (nUser === null) { nUser = "None" }
   
  let updateUser = new Discord.RichEmbed()
  .setColor(color)
  .setAuthor(newMember.user.username, newMember.user.displayAvatarURL)
  .setDescription(`${newMember} **Nickname changed!** ${oUser} -> ${nUser}`)
  
  log.send({embed: updateUser});
 }
  
  if (oldMember.roles.size < newMember.roles.size) {
    
   for (const role of newMember.roles.map(r => r.id)) {
   if (!oldMember.roles.has(role)) {
  
     let addRole = new Discord.RichEmbed()
     .setColor(color)
     .setThumbnail(newMember.user.displayAvatarURL)
     .setDescription(`**${newMember} Received a new role** \n${newMember.user.username}#${newMember.user.discriminator}`)
     .addField('Role', oldMember.guild.roles.get(role).name)

     return log.send({embed: addRole});
     
  };
  };
 };
   
  if (oldMember.roles.size > newMember.roles.size) {
   
   for (const role of oldMember.roles.map(r => r.id)) {
   if (!newMember.roles.has(role)) {
     
     let removeRole = new Discord.RichEmbed()
     .setColor(color)
     .setThumbnail(newMember.user.displayAvatarURL)
     .setDescription(`**${newMember} Lost a role**\n${oldMember.user.username}#${oldMember.user.discriminator}`)
     .addField('Role', oldMember.guild.roles.get(role).name)

     return log.send({embed: removeRole});
   };
   };
  };
 }); 

};
};