const { findChannelIdByUser, getEmbedInteraction, getAfterTicketCloseEmbedButtonRow } = require("../helpers/functions.js");
const config = require("../../config.js");
const db = require("quick.db");

module.exports = {
    name: 'guildMemberRemove',
    execute: async (member) => {

        try {

            const ticketChannelId = await findChannelIdByUser(member.user.id)

            if (ticketChannelId != null) {

                const ticketChannel = await member.client.channels.cache.find(c => c.id === ticketChannelId)

                if (ticketChannel != undefined) {
                    const ticketInfo = await db.fetch(`tickets.${ticketChannelId}`)
                    ticketChannel.send({ embeds: [getEmbedInteraction(config.ticket.messages.ticketOwnerJoined.embed, { locale: ticketInfo.locale })], components: [getAfterTicketCloseEmbedButtonRow({ locale: ticketInfo.locale }, "reopen")] }).then(async (msg) => {
                        await db.push(`tickets.${ticketChannelId}.deletableMessages`, msg.id)
                    })
                    console.log()
                } else {
                    db.delete(`tickets.${ticketChannelId}`)
                }

            }

        } catch (error) {
            console.log(error)
        }

    }
}
