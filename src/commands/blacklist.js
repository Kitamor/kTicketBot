const { SlashCommandBuilder } = require("@discordjs/builders");
const { getEmbedInteraction, getMessageInteraction } = require("../helpers/functions.js");
const db = require("quick.db");
const config = require("../../config.js");
const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blacklist")
        .setDescription("Adds/Removes/Lists the blacklist.")
        .addSubcommand(subcommand => subcommand
            .setName("add")
            .setDescription("Adds the user.")
            .addUserOption(option => option.setName('user').setDescription('Select user.').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName("remove")
            .setDescription("Remove the user.")
            .addUserOption(option => option.setName('user').setDescription('Select user.').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName("list")
            .setDescription("List the blacklist.")
        ),
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator) && !interaction.member.roles.cache.some(r => config.ticket.categories.some(c => c[interaction.locale].staffRoleId.includes(r.id)))) {
            return interaction.editReply({ embeds: [getEmbedInteraction(config.ticket.messages.dontHavePerm, interaction)] });
        }

        const subCommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser("user");
        let blacklist = await db.get("blacklist") || [];

        switch (subCommand) {
            case "add":
                if (blacklist.includes(user.id)) {
                    return interaction.editReply({ content: (getMessageInteraction(config.ticket.messages.blacklist.alreadyIn, interaction)).replace("[user]", user) });
                }
                blacklist.push(user.id);
                await db.set("blacklist", blacklist);
                return interaction.editReply({ content: (getMessageInteraction(config.ticket.messages.blacklist.successfullyAdded, interaction)).replace("[user]", user) });

            case "remove":
                if (!blacklist.includes(user.id)) {
                    return interaction.editReply({ content: (getMessageInteraction(config.ticket.messages.blacklist.notIn, interaction)).replace("[user]", user) });
                }
                blacklist = blacklist.filter(id => id !== user.id);
                await db.set("blacklist", blacklist);
                return interaction.editReply({ content: (getMessageInteraction(config.ticket.messages.blacklist.successfullyRemoved, interaction)).replace("[user]", user) });

            case "list":
                if (blacklist.length === 0) {
                    return interaction.editReply({ content: getMessageInteraction(config.ticket.messages.blacklist.blacklistEmpty, interaction) });
                }
                const message = blacklist.map(id => `<@${id}>`).join("\n");
                return interaction.editReply({ content: message });

            default:
                return interaction.editReply({ content: "Geçersiz alt komut." });
        }
    }
};
