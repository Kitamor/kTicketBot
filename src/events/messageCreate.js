const { isOwner, getEmbed, getTicketButtonRow } = require("../helpers/functions.js");
const config = require("../../config.js");

module.exports = {
    name: 'messageCreate',
    execute: async (message) => {
        let client = message.client;
        if (message.author.bot || message.channel.type === 'dm') return;
        if (message.guild.id !== config.guildId) return;

        const args = message.content.split(" ")

        if (isOwner(message.author.id) && args[0] === "!setup") {

            locale = args[1] || config.ticket.otherLanguage
            await message.channel.send({ embeds: [await getEmbed(config.ticket.messages.setupEmbed[locale])], components: [getTicketButtonRow()] })
            await message.delete()
            
        }
    }
};