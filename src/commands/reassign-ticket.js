const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("quick.db");
const config = require("../../config.js");
const { PermissionFlagsBits } = require("discord.js");
const { getEmbedInteraction, getEmbedInteractionReplace } = require("../helpers/functions.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket-reassign")
        .setDescription("Reassign the ticket another staff.")
        .addUserOption(option => option.setName("staff").setDescription("Staff").setRequired(true)),
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator) && !interaction.member.roles.cache.some(r => config.ticket.categories.some(c => c[interaction.locale].staffRoleId.includes(r.id)))) {
            return await interaction.editReply({ embeds: [getEmbedInteraction(config.ticket.messages.dontHavePerm, interaction)] });
        }

        const staff = interaction.options.getUser("staff");
        const staffMember = interaction.options.getMember("staff");

        if (!staffMember.permissions.has(PermissionFlagsBits.Administrator) && !staffMember.roles.cache.some(r => config.ticket.categories.some(c => c[interaction.locale].staffRoleId.includes(r.id)))) {
            return await interaction.editReply({ embeds: [getEmbedInteraction(config.ticket.messages["reassign-ticket"].memberDoesntHavePerm, interaction)] });
        }
        
        const ticketInfo = await db.fetch(`tickets.${interaction.channel.id}`)

        if (!ticketInfo) return await interaction.deleteReply()

        if (ticketInfo.assignedStaffId && config.ticket.staffRankingSystem.status === true) {
            await interaction.channel.permissionOverwrites.edit(await interaction.guild.members.cache.find(g => g.id === ticketInfo.assignedStaffId), {
                SendMessages: false
            }).catch((err) => {
                console.log(err)
            });

            await db.add(`staffs.allTime.${ticketInfo.assignedStaffId}.ticketCount`, -1)
            if (config.ticket.staffRankingSystem.dailyRanking === true) {
                await db.add(`staffs.daily.${ticketInfo.assignedStaffId}.ticketCount`, -1)
            }
            if (config.ticket.staffRankingSystem.weeklyRanking === true) {
                await db.add(`staffs.weekly.${ticketInfo.assignedStaffId}.ticketCount`, -1)
            }
            if (config.ticket.staffRankingSystem.monthlyRanking === true) {
                await db.add(`staffs.monthly.${ticketInfo.assignedStaffId}.ticketCount`, -1)
            }
        }

        await db.set(`tickets.${interaction.channel.id}.assignedStaffId`, staff.id)

        if (config.ticket.staffRankingSystem.status === true) {
            const staffDb = await db.fetch(`staffs.allTime.${staff.id}`)
            if (!staffDb) {
                await db.set(`staffs.allTime.${staff.id}`, { ticketCount: 1, messageCount: 0, rating: [] })
            } else {
                await db.add(`staffs.allTime.${staff.id}.ticketCount`, 1)
            }
            if (config.ticket.staffRankingSystem.dailyRanking === true) {
                const staffDb = await db.fetch(`staffs.daily.${staff.id}`)
                if (!staffDb) {
                    await db.set(`staffs.daily.${staff.id}`, { ticketCount: 1, messageCount: 0, rating: [] })
                } else {
                    await db.add(`staffs.daily.${staff.id}.ticketCount`, 1)
                }
            }
            if (config.ticket.staffRankingSystem.weeklyRanking === true) {
                const staffDb = await db.fetch(`staffs.weekly.${staff.id}`)
                if (!staffDb) {
                    await db.set(`staffs.weekly.${staff.id}`, { ticketCount: 1, messageCount: 0, rating: [] })
                } else {
                    await db.add(`staffs.weekly.${staff.id}.ticketCount`, 1)
                }
            }
            if (config.ticket.staffRankingSystem.monthlyRanking === true) {
                const staffDb = await db.fetch(`staffs.monthly.${staff.id}`)
                if (!staffDb) {
                    await db.set(`staffs.monthly.${staff.id}`, { ticketCount: 1, messageCount: 0, rating: [] })
                } else {
                    await db.add(`staffs.monthly.${staff.id}.ticketCount`, 1)
                }
            }
        }

        await interaction.channel.permissionOverwrites.edit(staffMember, {
            SendMessages: true
        }).then(channel => {
            channel.send({ embeds: [getEmbedInteractionReplace(config.ticket.messages.staffAssignedToTicket, ticketInfo, "[staff]", staff)] })
        }).catch((err) => {
            console.log(err)
        });

        await interaction.deleteReply()
    }
};
