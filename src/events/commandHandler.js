const { PermissionFlagsBits } = require("discord.js");
const config = require("../../config.js");
const { getButton } = require("../helpers/functions.js");
const db = require("quick.db");

module.exports = {
    name: 'messageCreate',
    execute: async (message) => {
        let client = message.client;
        if (message.author.bot || message.channel.type === 'dm') return;
        if (message.guild.id !== config.guildId) return;

        const args = message.content.split(" ")

        config.ticket.prefixCommands.forEach(async (command) => {
            if (config.ticket.prefix + command.command === args[0].toLowerCase()) {

                if (command.onlyStaff === true && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.roles.cache.some(r => ticketInfo.category[locale].staffRoleId.includes(r.id))) return message.delete()

                if (command.onlyTicket === true) {

                    const ticketInfo = await db.fetch(`tickets.${message.channel.id}`)
                    if (!ticketInfo) return await message.delete()

                    if (!command.button) {
                        await message.channel.send({
                            content: command.reply.replace("[ticketOwner]", `<@${ticketInfo.ticketOwnerId}>`).replace("[assignedStaff]", `<@${ticketInfo.assignedStaffId}>`).replace("[categoryName]", ticketInfo.category[ticketInfo.locale].name),
                        })
                    } else {
                        await message.channel.send({
                            content: command.reply.replace("[ticketOwner]", `<@${ticketInfo.ticketOwnerId}>`).replace("[assignedStaff]", `<@${ticketInfo.assignedStaffId}>`).replace("[categoryName]", ticketInfo.category[ticketInfo.locale].name),
                            components: [(command.button)]
                        })
                    }
                    if (command.instaDelete === true) await message.delete()

                } else {

                    if (!command.button) {
                        await message.channel.send({
                            content: command.reply.replace("[ticketOwner]", `<@${ticketInfo.ticketOwnerId}>`).replace("[assignedStaff]", `<@${ticketInfo.assignedStaffId}>`).replace("[categoryName]", ticketInfo.category[ticketInfo.locale].name),
                        })
                    } else {
                        await message.channel.send({
                            content: command.reply.replace("[ticketOwner]", `<@${ticketInfo.ticketOwnerId}>`).replace("[assignedStaff]", `<@${ticketInfo.assignedStaffId}>`).replace("[categoryName]", ticketInfo.category[ticketInfo.locale].name),
                            components: [getButton(command.button)]
                        })
                    }
                    if (command.instaDelete === true) await message.delete()

                }

            }
        })
    }
};