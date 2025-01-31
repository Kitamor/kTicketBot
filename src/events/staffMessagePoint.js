const config = require("../../config.js");
const db = require("quick.db");

module.exports = {
    name: 'messageCreate',
    execute: async (message) => {
        let client = message.client;
        if (message.author.bot || message.channel.type === 'dm') return;
        if (message.guild.id !== config.guildId) return;

        const ticketInfo = await db.fetch(`tickets.${message.channel.id}`)

        if (!ticketInfo) return;
        if (ticketInfo.assignedStaffId == null) return;

        const staff = await client.users.cache.find(s => s.id === ticketInfo.assignedStaffId)

        if (!staff) return;
        await db.add(`staffs.allTime.${ticketInfo.assignedStaffId}.messageCount`, 1)
        if(config.ticket.staffRankingSystem.dailyRanking === true) {
            await db.add(`staffs.daily.${ticketInfo.assignedStaffId}.messageCount`, 1)
        } 
        if(config.ticket.staffRankingSystem.weeklyRanking === true) {
            await db.add(`staffs.weekly.${ticketInfo.assignedStaffId}.messageCount`, 1)
        } 
        if(config.ticket.staffRankingSystem.monthlyRanking === true) {
            await db.add(`staffs.monthly.${ticketInfo.assignedStaffId}.messageCount`, 1)
        }

    }
};