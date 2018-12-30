const Discord = require("discord.js");
const client = new Discord.Client({disableEveryone: true});

const db = require('quick.db');
const fs = require("fs");
const path = require("path")
const logChannel = "524065931148656660"; // logs channel id
const bot = new Discord.Client()
bot.commands = new Discord.Collection()
const slowmode_mentions = new Map();
const slowmode_links = new Map();
const slowmode_attachments = new Map();
const ratelimit = 8500; // within 7.5 seconds
const config = require("./config.json");
const ms = require("parse-ms");
const spam = require("discord-anti-spam");

var token = config.token;
var prefix = config.prefix;
var color = config.color;

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir("./commands/Admin/", (err, files) => {
    
    if(err) console.error((err));
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0) return;
  
    jsfile.forEach((f, i) => {
        delete require.cache[require.resolve(`./commands/Admin/${f}`)]
        let props = require(`./commands/Admin/${f}`)
        console.log(`${i + 1}: ${f} loaded!`);
        client.commands.set(props.help.name, props);
        props.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);   
    });
  });
});

fs.readdir("./commands/", (err, files) => {
    
    if(err) console.error((err));
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0) return;
  
    jsfile.forEach((f, i) => {
        delete require.cache[require.resolve(`./commands/${f}`)]
        let props = require(`./commands/${f}`)
        console.log(`${i + 1}: ${f} loaded!`);
        client.commands.set(props.help.name, props);
        props.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);   
    });
  });
});

client.on(`message`, function(msg) {


	// Define command variable

  var command = msg.content.split(` `)[0].slice(config.prefix.length).toLowerCase()
  var args = msg.content.split(` `).slice(1);
  var msgs = 0;
  msgs++
  let suffix = args.join(` `)

  // mute command
  
if(command === "customer") {
    if(!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.reply('Sorry! Only Staff members can use this command!');
    var user = msg.mentions.users.first();
    var name = args.slice(2).join(" ")
    if(!user) return msg.reply('You didnt specify a user, please specify one')
    msg.guild.member(user).addRole(`523268690783895553`).then(() =>{

      msg.channel.send(`Customer Role has been given successfully.`)
    })
}

  if (command === "probation") {
	  let admin = msg.member.roles.find("name", "Staff");
	  if (!(admin)) {
		  return msg.channel.send("You are not Staff! :no_entry: ")
	  }
	  if (!(suffix)) {
		  return msg.channel.send("Please specify user with @user!")
	  }
		let mutedrole = msg.guild.roles.find("name", config.mutedrole);
		let member = msg.mentions.members.first();
		member.addRole(mutedrole).catch(console.error); // Give muted role to user
		const embed = new Discord.RichEmbed()

		.setColor(color)

		.addField("User put on 2 Week Probation", "User: " + member.toString() + " By: " + msg.author)

		msg.channel.send({embed});
		setTimeout(() => { member.removeRole(mutedrole).catch(console.error); }, 604800000); // Set the role back to online after 1 min.

    if (config.logadmincmd) {
      const log =  msg.guild.channels.find(`name`, config.adminlogchannel);
	   log.send(member.toString() + ` Has Been Put on probation 2 Weeks by: ` + msg.author.username);
    }
  }

})

client.on("message", message => {

	if (message.content.startsWith("!ping")) {
		let startTime = Date.now();
		message.channel.send("Ping...").then(newMessage => {
			let endTime = Date.now();
			newMessage.edit("Pong! Took `" + Math.round(endTime - startTime) + "ms`!");
		});
	}

	function log(logmessage) {
		if (message.guild.channels.has(logChannel)) {
			message.guild.channels.get(logChannel).send({ embed: logmessage}).then().catch(err => console.log(err));
		}
	}

	// set the max mentions/links/attachments that are allowed
	let banLevel = {
		"mentions": 3,
		"links": 5,
		"attachments": 6
	};

	// Ignore bots, DMs, Webhooks, if this bot has no perms, and Mods
	if (message.author.bot || !message.guild || !message.member || !message.guild.member(client.user).hasPermission("BAN_MEMBERS") || message.member.hasPermission("MANAGE_MESSAGES")) return;

	// Ignore if 1 mention and it's a bot (bot interaction)
	if (message.mentions.users.size == 1 && message.mentions.users.first().bot) return;

	// If there is no trace of the author in the slowmode map, add them.
	let entry_mentions = slowmode_mentions.get(message.author.id);
	let entry_links = slowmode_links.get(message.author.id);
	let entry_attachments = slowmode_attachments.get(message.author.id);

	if (!entry_mentions) {
		entry_mentions = 0;
		slowmode_mentions.set(message.author.id, entry_mentions);
	}
	if (!entry_links) {
		entry_links = 0;
		slowmode_links.set(message.author.id, entry_links);
	}
	if (!entry_attachments) {
		entry_attachments = 0;
		slowmode_attachments.set(message.author.id, entry_attachments);
	}

	// Count the unique user and roles mentions, links and attachments
	entry_mentions += message.mentions.users.size + message.mentions.roles.size;
	entry_links += message.embeds.length;
	entry_attachments += message.attachments.size;
	// Set all the amounts in the slowmode maps
	slowmode_mentions.set(message.author.id, entry_mentions);
	slowmode_links.set(message.author.id, entry_links);
	slowmode_attachments.set(message.author.id, entry_attachments);

	// If the total number of links in the last ratelimit is above the server ban level, ban user
	if (entry_links > banLevel.links) {
		message.member.ban(1).then(member => {
			message.channel.send(`:ok_hand: banned \`${message.author.tag}\` for \`link spam\``);
			log(new Discord.RichEmbed().setTitle(':hammer: Banned').setColor(0xFF0000).setTimestamp().addField('User', `${message.author.tag} (${message.author.id})`).addField('Reason', `Posting too many links (${entry_links}x)`));
			slowmode_links.delete(message.author.id);
		})
		.catch(e => {
			log(new Discord.RichEmbed().setTitle(':x: ERROR').setColor(0x000001).setTimestamp().addField('User', `${message.author.tag} (${message.author.id})`).addField('Reason', `Could not ban because they have a higher role`));
		});
	} else {
		setTimeout(()=> {
			entry_links -= message.embeds.length;
			if(entry_links <= 0) slowmode_links.delete(message.author.id);
		}, ratelimit);
	}

	if (entry_mentions > banLevel.mentions) {
		message.member.ban(1).then(member => {
			message.channel.send(`:ok_hand: banned \`${message.author.tag}\` for \`mention spam\``);
			log(new Discord.RichEmbed().setTitle(':hammer: Banned').setColor(0xFF0000).setTimestamp().addField('User', `${message.author.tag} (${message.author.id})`).addField('Reason', `Mentioning too many users (${entry_mentions}x)`));
			slowmode_mentions.delete(message.author.id);
		})
		.catch(e => {
			log(new Discord.RichEmbed().setTitle(':x: ERROR').setColor(0x000001).setTimestamp().addField('User', `${message.author.tag} (${message.author.id})`).addField('Reason', `Could not ban because they have a higher role`));
		});
	} else {
		setTimeout(()=> {
			entry_mentions -= message.mentions.users.size + message.mentions.roles.size;
			if(entry_mentions <= 0) slowmode_mentions.delete(message.author.id);
		}, ratelimit);
	}

	if (entry_attachments > banLevel.attachments) {
		message.member.ban(1).then(member => {
			message.channel.send(`:ok_hand: banned \`${message.author.tag}\` for \`image spam\``);
			log(new Discord.RichEmbed().setTitle(':hammer: Banned').setColor(0xFF0000).setTimestamp().addField('User', `${message.author.tag} (${message.author.id})`).addField('Reason', `Posting too many images (${entry_attachments}x)`));
			slowmode_attachments.delete(message.author.id);
		})
		.catch(e => {
			log(new Discord.RichEmbed().setTitle(':x: ERROR').setColor(0x000001).setTimestamp().addField('User', `${message.author.tag} (${message.author.id})`).addField('Reason', `Could not ban because they have a higher role`));
		});
	} else {
		setTimeout(()=> {
			entry_attachments -= message.attachments.size;
			if(entry_attachments <= 0) slowmode_attachments.delete(message.author.id);
		}, ratelimit);
	}

});

fs.readdir("./events/", (async function (err, files) {
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  
  jsfile.forEach(file => {
    const eventName = file.split(".")[0];
    const event = new(require(`./events/${file}`))(client);
  
    client.on(eventName, (...args) => event.run(...args));
    const mod = require.cache[require.resolve(`./events/${file}`)];
    delete require.cache[require.resolve(`./events/${file}`)];
    const index = mod.parent.children.indexOf(mod);
    if (index !== -1) mod.parent.children.splice(index, 1);
  });
}))

client.on("disconnect", () => console.log("Client is disconnecting."))
 .on("error", e => console.log(e));

const authors = [];
var warned = [];
var banned = [];
var messagelog = [];

client.on('message', (async function (message) {
  
 const maxDuplicatesWarning = 6; //max dup message to warn
 const maxDuplicatesBan = 10; //max dup message to ban
 const interval = 5000;
 const maxBuffer = 6; //max message span within interval to ban
 const warnBuffer = 4; //max message span within interval to warn
 const days = 1; //days in messages purged on ban
 let cool = 30000, //interval between warnings
       amount = 1;
  
   let warnComplete = new Discord.RichEmbed()
   .setColor(color)
   .setAuthor(message.author.username, message.author.displayAvatarURL)
   .addField(`User`, message.author.tag, true)
   .addField(`Action`, `Warn`, true)
   .addField(`Reason`, `Spam/Flood (Auto Detection)`, true)
   .setColor(color)
   .setTimestamp()
   
   let banComplete = new Discord.RichEmbed()
   .setColor(color)
   .setAuthor(message.author.username, message.author.displayAvatarURL)
   .addField(`User`, message.author.tag, true)
   .addField(`Action`, `Ban`, true)
   .addField(`Reason`, `Spam/Flood (Auto Detection)`, true)
   .setColor(color)
   .setTimestamp()
   
   let error = new Discord.RichEmbed()
   .setColor("#F04947")
   .setDescription("<:error:494589880886755357> Insufficient permission to ban " + message.author + " for `Spam/Flood`")
   
   let banMessage = new Discord.RichEmbed()
   .setColor("#F04947")
   .setDescription(""+ message.author +" has been banned for `Spam/Flood` (Auto)")
   
   let warnMessage = new Discord.RichEmbed()
   .setColor("#F04947")
   .setDescription(""+ message.author +" watch the flood!")
  
    if (message.author.bot) return;
    if (message.guild.id === "416710907553382410") return;
    if (message.member.hasPermission("MANAGE_MESSAGES")) return;

    let time = await db.fetch(`time_${message.author.id}`);

    if (message.author.id != client.user.id) {
      
      var now = Math.floor(Date.now());
      authors.push({
        "time": now,
        "author": message.author.id
      });
      messagelog.push({
        "message": message.content,
        "author": message.author.id
      });

      var msgMatch = 0;
      for (var i = 0; i < messagelog.length; i++) {
        if (messagelog[i].message == message.content && (messagelog[i].author == message.author.id) && (message.author.id !== client.user.id)) {
          msgMatch++;
        }
      }
      
      if (msgMatch == maxDuplicatesWarning && !warned.includes(message.author.id)) {
        
      if (time !== null && cool - (Date.now() - time) > 0) {
        //warned.splice(warned.indexOf(authors[i]));
        return;
      } else {
       db.set(`time_${message.author.id}`, Date.now());
        warn(message, message.author.id);
       }
      }
      
      if (msgMatch == maxDuplicatesBan && !banned.includes(message.author.id)) {
        console.log("1")
        ban(message, message.author.id);
      }

      var matched = 0;

      for (var i = 0; i < authors.length; i++) {
        if (authors[i].time > now - interval) {
        
        matched++;
        
        if (matched == warnBuffer && !warned.includes(message.author.id)) {
            
        if (time !== null && cool - (Date.now() - time) > 0) {
         //warned.splice(warned.indexOf(authors[i]));
         return;
        } else {
          db.set(`time_${message.author.id}`, Date.now());
          warn(message, message.author.id);
           }
          }
          else if (matched == maxBuffer) {
            if (!banned.includes(message.author.id)) {
        console.log("2")
              ban(message, message.author.id);
            }
          }
        }
        else if (authors[i].time < now - interval) {
          authors.splice(i);
          warned.splice(warned.indexOf(authors[i]));
          banned.splice(warned.indexOf(authors[i]));
        }
        if (messagelog.length >= 200) {
          messagelog.shift();
        }
      }
    }
  
  function warn(msg, userid) {
      
    warned.push(msg.author.id);
    msg.channel.send({embed: warnMessage});
         
    db.fetch(`modChannel_${message.guild.id}`).then(channel => {
    if (!channel) return;
    else if (channel === "none") return;
    let log = message.guild.channels.get(channel);
      
    log.send({embed: warnComplete});
    })
  }
  
  function ban(msg, userid) {
    for (var i = 0; i < messagelog.length; i++) {
      if (messagelog[i].author == msg.author.id) {
        messagelog.splice(i);
      }
    }

    banned.push(msg.author.id);

    var user = msg.channel.guild.members.find(member => member.user.id === msg.author.id);
    if (user) {
      user.ban(days).then((member) => {
        msg.channel.send({embed: banMessage});
        
         db.fetch(`modChannel_${message.guild.id}`).then(channel => {
         if (!channel) return;
         else if (channel === "none") return;
         let log = message.guild.channels.get(channel);
   
         console.log("3")
         log.send({embed: banComplete})
         return true;
         })
     }).catch(() => {
        msg.channel.send({embed: error});
        return false;
     });
    }
  }
  
}));

client.login(token);

const express = require('express');
const app = express();
const http = require('http');

app.get("/", (request, response) => {
  response.sendStatus(204)
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 60000);