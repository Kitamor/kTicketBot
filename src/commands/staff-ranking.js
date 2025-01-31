const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const db = require("quick.db");
const config = require("../../config.js");
const { PermissionFlagsBits } = require("discord.js");
const { getEmbedInteraction } = require("../helpers/functions.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("staff-ranking")
        .setDescription("Shows staffs ticket ranking.")
        .addSubcommand(subcommand => subcommand.setName("daily").setDescription("Daily"))
        .addSubcommand(subcommand => subcommand.setName("weekly").setDescription("Weekly"))
        .addSubcommand(subcommand => subcommand.setName("monthly").setDescription("Monthly"))
        .addSubcommand(subcommand => subcommand.setName("alltime").setDescription("All Time")),
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator) && !interaction.member.roles.cache.some(r => config.ticket.categories.some(c => c[interaction.locale].staffRoleId.includes(r.id)))) {
            return interaction.editReply({ embeds: [getEmbedInteraction(config.ticket.messages.dontHavePerm, interaction)] });
        }

        const subCommand = interaction.options.getSubcommand();
        let staffs = {};

        switch (subCommand) {
            case "daily":
                staffs = await db.get("staffs.daily") || {};
                break;
            case "weekly":
                staffs = await db.get("staffs.weekly") || {};
                break;
            case "monthly":
                staffs = await db.get("staffs.monthly") || {};
                break;
            case "alltime":
                staffs = await db.get("staffs.allTime") || {};
                break;
            default:
                staffs = await db.get("staffs.allTime") || {};
                break;
        }

        const sortedUsers = Object.entries(staffs)
            .sort(([, a], [, b]) => {
                if (a.ticketCount !== b.ticketCount) {
                    return b.ticketCount - a.ticketCount;
                }
                if (a.messageCount !== b.messageCount) {
                    return b.messageCount - a.messageCount;
                }

                function getRating(staff) {
                    if (!staff.rating || staff.rating.length === 0) {
                        return 0; 
                    }
            
                    const totalRating = staff.rating.reduce((acc, entry) => acc + entry.rating, 0);
            
                    const averageRating = totalRating / staff.rating.length;
                
                    return averageRating;
                }
                return getRating(b) - getRating(a);
            });

        const itemsPerPage = 5;
        let page = 1;
        const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

        const getPaginatedEmbed = (page) => {
            const startIndex = (page - 1) * itemsPerPage;
            const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);

            let embedDescription = "";

            var locale = interaction.locale
            const rankingFormat = config.ticket.messages["staff-ranking"].ranking[locale];
            if (!rankingFormat) {
                var locale = config.ticket.otherLanguage
            }

            paginatedUsers.forEach(([userId, staff], index) => {
                const rankEmoji = config.ticket.messages["staff-ranking"].rankEmoji[startIndex + index] || `**${startIndex + index + 1}.**`;
                const nn = index >= 4 ? "" : "\n"

                function getRating() {
                    if (!staff.rating || staff.rating.length === 0) {
                        return 0; 
                    }
            
                    const totalRating = staff.rating.reduce((acc, entry) => acc + entry.rating, 0);
            
                    const averageRating = totalRating / staff.rating.length;
                
                    return averageRating;
                }

                embedDescription += rankingFormat
                    .replace("[rank]", rankEmoji)
                    .replace("[staff]", `<@${userId}>`)
                    .replace("[ticketCount]", staff.ticketCount)
                    .replace("[messageCount]", staff.messageCount)
                    .replace("[averageRating]", getRating())
                    .replace("[ratingEmoji]", config.ticket.sendRateMessageToUserAfterTicketClosed.button.name)
                    + nn;
            });

            var locale = interaction.locale
            const embedConfig = config.ticket.messages["staff-ranking"].embed[locale];
            if (!embedConfig) {
                var locale = config.ticket.otherLanguage
            }
            const embed = new EmbedBuilder()
                .setTitle(embedConfig.title)
                .setDescription(`${embedConfig.description}\n${embedDescription}`)
                .setColor(embedConfig.color)
                .setFooter({ text: `${embedConfig.footer.replace("[currentPage]", page).replace("[maxPage]", totalPages === 0 ? 1 : totalPages)}` });

            if (embedConfig.image != "" && embedConfig.image != null && embedConfig.image != undefined && embedConfig.image != false) embed.setImage(embedConfig.image)
            return embed;
        };

        var previousLocale = interaction.locale
        const previousButton = config.ticket.messages["staff-ranking"].previousButton[previousLocale];
        if (!previousButton) {
            var previousLocale = config.ticket.otherLanguage
        }

        var nextLocale = interaction.locale
        const nextButton = config.ticket.messages["staff-ranking"].nextButton[nextLocale];
        if (!nextButton) {
            var nextLocale = config.ticket.otherLanguage
        }

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(config.ticket.messages["staff-ranking"].previousButton.id)
                .setLabel(previousButton.name)
                .setEmoji(previousButton.emoji)
                .setStyle(previousButton.type)
                .setDisabled(page <= 1),
            new ButtonBuilder()
                .setCustomId(config.ticket.messages["staff-ranking"].nextButton.id)
                .setLabel(nextButton.name)
                .setEmoji(nextButton.emoji)
                .setStyle(nextButton.type)
                .setDisabled(page >= totalPages)
        );

        await interaction.deleteReply();
        const embedMessage = await interaction.channel.send({ embeds: [getPaginatedEmbed(page)], components: [row], fetchReply: true });

        const collector = embedMessage.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async (buttonInteraction) => {
            if (buttonInteraction.user.id !== interaction.user.id) {
                return buttonInteraction.reply({ embeds: [getEmbedInteraction(config.ticket.messages["staff-ranking"].onlyUsableByCommandSender, interaction)], ephemeral: true })
            }

            if (buttonInteraction.customId === config.ticket.messages["staff-ranking"].previousButton.id) {
                page = Math.max(1, page - 1);
            } else if (buttonInteraction.customId === config.ticket.messages["staff-ranking"].nextButton.id) {
                page = Math.min(totalPages, page + 1);
            }

            var previousLocale = interaction.locale
            const previousButton = config.ticket.messages["staff-ranking"].previousButton[previousLocale];
            if (!previousButton) {
                var previousLocale = config.ticket.otherLanguage
            }

            var nextLocale = interaction.locale
            const nextButton = config.ticket.messages["staff-ranking"].nextButton[nextLocale];
            if (!nextButton) {
                var nextLocale = config.ticket.otherLanguage
            }

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(config.ticket.messages["staff-ranking"].previousButton.id)
                    .setLabel(previousButton.name)
                    .setEmoji(previousButton.emoji)
                    .setStyle(previousButton.type)
                    .setDisabled(page <= 1),
                new ButtonBuilder()
                    .setCustomId(config.ticket.messages["staff-ranking"].nextButton.id)
                    .setLabel(nextButton.name)
                    .setEmoji(nextButton.emoji)
                    .setStyle(nextButton.type)
                    .setDisabled(page >= totalPages)
            );

            await buttonInteraction.update({
                embeds: [getPaginatedEmbed(page)], components: [row]
            });
        });

        collector.on('end', async () => {
            var locale = interaction.locale
            const pagesDisabled = config.ticket.messages["staff-ranking"].pagesDisabled[locale];
            if (!pagesDisabled) {
                var locale = config.ticket.otherLanguage
            }
            const components = row.components.map(component => component.setDisabled(true));
            await embedMessage.edit({
                content: pagesDisabled,
                components: [new ActionRowBuilder().addComponents(components)]
            }).catch(err => { })
        });
    }
};
