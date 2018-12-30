const Discord = require("discord.js")
const config = require("../config.json");
 var color = config.color;
module.exports.run = async(bot, message, arg, arg1, arg2, arg3, config) => {
    const ip = new Discord.RichEmbed()
        .setTitle("Demo Links")
        .setColor(color)
        .setDescription("Login Using \nDEMO Login: demo@demo.com 					\nDEMO Password: DEMO19 ")
        .addField("Classic CAD Demo", "Front end= $3.00 USD\nBack end= $6.00 USD \nhttps://classic-demo.bubbleapps.io/")
        .addField("Ion CAD Demo", "Front end= $2.50 USD\nBack end= $5.00 USD\nhttps://ion-demo.bubbleapps.io/")
        .addField("Galaxy CAD Demo", "Front end= $6.00 USD\nBack end= $12.00 USD\nhttps://galaxy-demo.bubbleapps.io/")
        .addField("Xenon CAD Demo", "Front end= $12.00 USD\nBack end= $24.00 USD\nhttps://xenon-demo.bubbleapps.io/")
        .addField("Eclipse CAD Demo", "Front end= $6.00 USD\nBack end= $12.00 USD\nhttps://eclipse-demo.bubbleapps.io/")
        .addField("Revelation CAD Demo", "Front end= $16.00 USD\nBack end= $32.00 USD\nhttps://revelation-demo.bubbleapps.io/")
        .addField("Simple Application", "Front end= N/A\nBack end= $6.00 USD")
        .addField("Complex Application", "Front end= $8.00 USD\nBack end= $16.00 USD")		
    message.channel.send(ip)
}   

module.exports.help = {
    name: "demo"
}
module.exports.aliases = []