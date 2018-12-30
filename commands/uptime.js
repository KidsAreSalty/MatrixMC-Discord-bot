const Discord = require("discord.js")
const config = require("../config.json");
 var color = config.color;
module.exports.run = async(bot, message, arg, arg1, arg2, arg3, config) => {

    function format(seconds){
        function pad(s){
          return (s < 10 ? '0' : '') + s;
        }
        var hours = Math.floor(seconds / (60*60));
        var minutes = Math.floor(seconds % (60*60) / 60);
        var seconds = Math.floor(seconds % 60);
  
        return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
      }

    const uptime = new Discord.RichEmbed()
        .setTitle("Bot Uptime")
        .setColor(color)
        .addField("Uptime Format", `HH:MM:SS`, true)
        .addField("Uptime", `${format(process.uptime())}`, true)

    message.channel.send(uptime)
}   

module.exports.help = {
    name: "uptime"
}
module.exports.aliases = []