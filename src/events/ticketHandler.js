const { findChannelIdByUser, getTicketCategoryButtonRow, getTicketCategoryMenuRow, getEmbedInteraction, getEmbedInteractionReplace, isBlacklisted, getNewTicketEmbedButtonRow, getModal, getEmbed, getAfterTicketCloseEmbedButtonRow, getEmbedReplace, getTicketRatingButtonRow, log } = require("../helpers/functions.js");
const config = require("../../config.js");
const { PermissionFlagsBits, ChannelType, EmbedBuilder } = require("discord.js");
const db = require("quick.db");
const moment = require("moment");
const { writeFile } = require("fs");
const discordTranscripts = require('discord-html-transcripts');

module.exports = {
    name: 'interactionCreate',
    execute: async (interaction) => {

        let client = interaction.client;

        async function askModalQuestion(category, cIndex) {

            let locale = interaction.locale
            if (!category[locale]) {
                locale = config.ticket.otherLanguage
            }

            modal = {
                title: category[locale].name,
                customId: "TicketModal" + cIndex,
                inputCustomId: "ModalQuestion",
                input: category[locale].questions,
            }
            await interaction.showModal(getModal(modal));
        }






        async function createTicket(category, fields = []) {

            let locale = interaction.locale
            if (!category[locale]) {
                locale = config.ticket.otherLanguage
            }

            if (await isBlacklisted(interaction.user.id)) {
                if (config.ticket.ticketBlacklist.status === "reply") {
                    await interaction.reply({ embeds: [getEmbedInteraction(config.ticket.ticketBlacklist.embed, interaction)], ephemeral: true })
                    return
                } else {
                    await interaction.deferUpdate()
                    return
                }
            }

            await interaction.deferReply({ ephemeral: true })

            const tryToFindChannel = await findChannelIdByUser(interaction.user.id)

            if (tryToFindChannel != null) {
                const ticketInfo = await db.fetch(`tickets.${tryToFindChannel}`)
                const channel = await client.channels.cache.find(c => c.id === tryToFindChannel)

                if (channel != null) {
                    if (ticketInfo.ticketCloserId == null) {
                        await interaction.editReply({ embeds: [getEmbedInteractionReplace(config.ticket.messages.ticketAlreadyExists, interaction, "[channel]", channel)] })
                        return
                    }
                } else {
                    await db.delete(`tickets.${tryToFindChannel}`)
                }
            }

            let permissionsArray = [
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.SendMessages,
                    ],
                },
                {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
            ];

            let staffPerms = []

            if (config.ticket.ticketAssignment.status === true || config.ticket.ticketAssignment.status === "true") {
                staffPerms = {
                    deny: [PermissionFlagsBits.SendMessages],
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ReadMessageHistory,
                    ]
                }
            } else {
                staffPerms = {
                    deny: [],
                    allow: [
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ReadMessageHistory,
                    ]
                }
            }

            category[locale].staffRoleId.forEach(staffRoleId => {
                permissionsArray.push(
                    {
                        id: staffRoleId,
                        deny: staffPerms.deny,
                        allow: staffPerms.allow,
                    },
                )
            });

            let embedFields = []

            if (config.ticket.messages.newTicketChannel.createdBy.status) {
                embedFields.push(
                    { name: config.ticket.messages.newTicketChannel.createdBy[locale], value: `${interaction.user}` }
                )
            }
            if (config.ticket.messages.newTicketChannel.category.status) {
                embedFields.push(
                    { name: config.ticket.messages.newTicketChannel.category[locale], value: category[locale].name }
                )
            }
            if (fields.length > 0) {
                fields.forEach(field => {
                    embedFields.push(
                        { name: field.name, value: field.value }
                    )
                })
            }

            await interaction.guild.channels.create({
                name: `${category[locale].channelName}-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: category[locale].parentCategoryId || category[config.ticket.otherLanguage].parentCategoryId,
                permissionOverwrites: permissionsArray,
            }).then(async ticketChannel => {
                await db.set(`tickets.${ticketChannel.id}`, { "ticketOwnerId": interaction.user.id, "category": category, "locale": interaction.locale, "deletableMessages": [] })
                await interaction.editReply({ embeds: [getEmbedInteractionReplace(config.ticket.messages.ticketOpened, interaction, "[channel]", `<#${ticketChannel.id}>`)] })
                await ticketChannel.send({ embeds: [getEmbedInteractionReplace(config.ticket.messages.newTicketChannel.embed, interaction, "[user]", interaction.user, embedFields)], components: [getNewTicketEmbedButtonRow(interaction)] })
                if (config.ticket.mentionCategoryStaffsWhenTicketOpened.status === true) {
                    ticketChannel.send("<@&" + category[locale].staffRoleId.join(">, <@&") + ">").then(async (msg) => {
                        if (config.ticket.mentionCategoryStaffsWhenTicketOpened.deleteAfterMention === true) await msg.delete()
                    })
                }
            })
        }



        async function assignTicket() {
            const ticketInfo = await db.fetch(`tickets.${interaction.channel.id}`)
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator) && !interaction.member.roles.cache.some(r => ticketInfo.category[ticketInfo.locale].staffRoleId.includes(r.id))) return interaction.reply({ embeds: [getEmbedInteraction(config.ticket.messages.dontHavePerm, interaction)], ephemeral: true })

            await interaction.update({ components: [getNewTicketEmbedButtonRow(ticketInfo, true)] })
            await db.set(`tickets.${interaction.channel.id}.assignedStaffId`, interaction.user.id)

            if (config.ticket.staffRankingSystem.status === true) {
                const staffDb = await db.fetch(`staffs.allTime.${interaction.user.id}`)
                if (!staffDb) {
                    await db.set(`staffs.allTime.${interaction.user.id}`, { ticketCount: 1, messageCount: 0, rating: [] })
                } else {
                    await db.add(`staffs.allTime.${interaction.user.id}.ticketCount`, 1)
                }
                if (config.ticket.staffRankingSystem.dailyRanking === true) {
                    const staffDb = await db.fetch(`staffs.daily.${interaction.user.id}`)
                    if (!staffDb) {
                        await db.set(`staffs.daily.${interaction.user.id}`, { ticketCount: 1, messageCount: 0, rating: [] })
                    } else {
                        await db.add(`staffs.daily.${interaction.user.id}.ticketCount`, 1)
                    }
                }
                if (config.ticket.staffRankingSystem.weeklyRanking === true) {
                    const staffDb = await db.fetch(`staffs.weekly.${interaction.user.id}`)
                    if (!staffDb) {
                        await db.set(`staffs.weekly.${interaction.user.id}`, { ticketCount: 1, messageCount: 0, rating: [] })
                    } else {
                        await db.add(`staffs.weekly.${interaction.user.id}.ticketCount`, 1)
                    }
                }
                if (config.ticket.staffRankingSystem.monthlyRanking === true) {
                    const staffDb = await db.fetch(`staffs.monthly.${interaction.user.id}`)
                    if (!staffDb) {
                        await db.set(`staffs.monthly.${interaction.user.id}`, { ticketCount: 1, messageCount: 0, rating: [] })
                    } else {
                        await db.add(`staffs.monthly.${interaction.user.id}.ticketCount`, 1)
                    }
                }
            }

            await interaction.channel.permissionOverwrites.edit(interaction.member, {
                SendMessages: true
            }).then(channel => {
                channel.send({ embeds: [getEmbedInteractionReplace(config.ticket.messages.staffAssignedToTicket, ticketInfo, "[staff]", interaction.user)] })
            }).catch((err) => {
                console.log(err)
            });
        }





        async function closeTicket() {
            const ticketInfo = await db.fetch(`tickets.${interaction.channel.id}`)
            const ticketOwner = await interaction.guild.members.cache.find(m => m.id === ticketInfo.ticketOwnerId)

            await db.set(`tickets.${interaction.channel.id}.ticketCloserId`, interaction.user.id)

            await interaction.channel.permissionOverwrites.edit(ticketOwner, {
                SendMessages: false,
                ViewChannel: false,
                ReadMessageHistory: false
            }).then(async channel => {
                await channel.send({ embeds: [getEmbedInteraction(config.ticket.messages.ticketClosed.embed, ticketInfo)], components: [getAfterTicketCloseEmbedButtonRow(ticketInfo)] }).then(async (msg) => {
                    await db.push(`tickets.${interaction.channel.id}.deletableMessages`, msg.id)
                })
            }).catch(async (err) => {
                await deleteTicket()
            });
        }





        async function reopenTicket() {
            const deletableMessages = await db.fetch(`tickets.${interaction.channel.id}.deletableMessages`)

            await db.set(`tickets.${interaction.channel.id}.deletableMessages`, [])
            if (deletableMessages.length > 0) {
                deletableMessages.forEach(async mId => {
                    let msg = await interaction.channel.messages.fetch(mId)
                    await msg.delete().then(async () => {
                    }).catch(async (err) => {
                        console.log(err)
                    });
                })
            }


            const ticketInfo = await db.fetch(`tickets.${interaction.channel.id}`)
            const ticketOwner = await interaction.guild.members.cache.find(m => m.id === ticketInfo.ticketOwnerId)

            await interaction.channel.permissionOverwrites.edit(ticketOwner, {
                SendMessages: true,
                ViewChannel: true,
                ReadMessageHistory: true
            }).then(async channel => {
                await db.delete(`tickets.${interaction.channel.id}.ticketCloserId`)
                if (config.ticket.mentionOwnerWhenTicketReopened.status === true) {
                    await channel.send({ content: `${ticketOwner}`, embeds: [getEmbedInteractionReplace(config.ticket.messages.ticketReopened.embed, ticketInfo, "[staff]", interaction.user)] })
                } else {
                    await channel.send({ content: `${ticketOwner}`, embeds: [getEmbedInteractionReplace(config.ticket.messages.ticketReopened.embed, ticketInfo, "[staff]", interaction.user)] })
                }
            }).catch((err) => {
                console.log(err)
            });
        }






        async function deleteTicket() {
            const deletableMessages = await db.fetch(`tickets.${interaction.channel.id}.deletableMessages`)

            await db.set(`tickets.${interaction.channel.id}.deletableMessages`, [])
            if (deletableMessages.length > 0) {
                deletableMessages.forEach(async mId => {
                    let msg = await interaction.channel.messages.fetch(mId)
                    await msg.delete().then(async () => {
                    }).catch(async (err) => {
                        console.log(err)
                    });
                })
            }

            const ticketInfo = await db.fetch(`tickets.${interaction.channel.id}`)

            const embedFields = []

            const transcriptLog = config.ticket.messages.transcriptLog
            if (transcriptLog.ticketOwner.status === true) {
                embedFields.push(
                    { name: transcriptLog.ticketOwner.content, value: `<@${ticketInfo.ticketOwnerId}>` }
                )
            }
            if (transcriptLog.ticketCloser.status === true) {
                embedFields.push(
                    { name: transcriptLog.ticketCloser.content, value: `${ticketInfo.ticketCloserId ? `<@${ticketInfo.ticketCloserId}>` : transcriptLog.ticketCloser.undefined}` }
                )
            }
            if (transcriptLog.ticketAssignedStaff.status === true) {
                embedFields.push(
                    { name: transcriptLog.ticketAssignedStaff.content, value: `${ticketInfo.assignedStaffId ? `<@${ticketInfo.assignedStaffId}>` : transcriptLog.ticketAssignedStaff.undefined}` }
                )
            }
            if (transcriptLog.ticketCategory.status === true) {
                embedFields.push(
                    { name: transcriptLog.ticketCategory.content, value: `${ticketInfo.category[ticketInfo.locale].name}` }
                )
            }
            if (transcriptLog.ticketLocale.status === true) {
                embedFields.push(
                    { name: transcriptLog.ticketLocale.content, value: `${ticketInfo.locale}` }
                )
            }

            if (config.ticket.transcript.status === "true" || config.ticket.transcript.status === true) {

                const attachment = await discordTranscripts.createTranscript(interaction.channel, {
                    limit: -1,
                    returnType: 'attachment',
                    filename: `${interaction.channel.name}-${moment().format("DD-MM-YYYY-HH-mm-ss")}-transcript.html`,
                    saveImages: config.ticket.transcript.saveImages === "true" || config.ticket.transcript.saveImages === true ? true : false,
                    poweredBy: false
                });

                const logChannelId = config.ticket.transcript.transcriptLogChannelId
                if (logChannelId != "" && logChannelId != null && logChannelId != undefined && logChannelId != false) {
                    const logChannel = client.channels.cache.find(c => c.id === logChannelId)
                    if (logChannel) {
                        logChannel.send({ embeds: [getEmbedReplace(transcriptLog.embed, "[user]", `<@${ticketInfo.ticketOwnerId}>`, embedFields)], files: [attachment] })
                    }
                }
                if (config.ticket.transcript.transcriptFolder != false && config.ticket.transcript.transcriptFolder != "false") {
                    await writeFile(config.ticket.transcript.transcriptFolder + `/${interaction.channel.name}-${moment().format("DD-MM-YYYY-HH-mmss")}-transcript.html`, attachment.attachment, err => {
                        if (err) {
                            console.log(err);

                            throw err;
                        }
                    })
                }

            }




            if (config.ticket.sendRateMessageToUserAfterTicketClosed.status === true && config.ticket.ticketAssignment.status === true) {
                let ticketOwner = await interaction.guild.members.cache.find(m => m.id === ticketInfo.ticketOwnerId)
                if (ticketOwner != undefined && ticketInfo.assignedStaffId != undefined) {
                    try {
                        const dmChannel = await ticketOwner.user.createDM();
                        await ticketOwner.send({ embeds: [getEmbedInteractionReplace(config.ticket.sendRateMessageToUserAfterTicketClosed.embed, ticketInfo, "[staff]", `<@${ticketInfo.assignedStaffId}>`)], components: [getTicketRatingButtonRow(ticketInfo.assignedStaffId)] })
                    } catch (error) {
                        console.error("Error while sending DM to the ticket owner.", error);
                    }

                }
            } else if (config.ticket.sendRateMessageToUserAfterTicketClosed.status === true) {
                log("Scoring message was not sent to the user: Since the scoring system is a staff-based feature and you turn off your assignment feature, it is automatically disabled. If you want to use the rating feature, you must also activate the ticket assignment feature.")
            }




            await interaction.channel.send({ embeds: [getEmbedInteraction(config.ticket.messages.ticketDeleted.embed, ticketInfo)] }).then(() => {
                setTimeout(async () => {
                    await db.delete(`tickets.${interaction.channel.id}`)
                    await interaction.channel.delete();
                }, 3000)
            })
        }








        if (interaction.isButton()) {

            if (interaction.customId === config.ticket.ticketOpenerButton.id) {

                let isFirstTicket = await db.fetch(`users.${interaction.user.id}.didUserOpenTicketBefore`)

                if (isFirstTicket !== true && config.ticket.askHowDidYouHearUs.status === true) {
                    let modal = config.ticket.askHowDidYouHearUs
                    let locale = interaction.local
                    if (!modal[locale]) {
                        locale = config.ticket.otherLanguage
                    }
                    let modalProp = {
                        title: modal[locale].title,
                        customId: modal.customId,
                        inputCustomId: modal.inputCustomId,
                        input: modal[locale].input,
                    }
                    await interaction.showModal(getModal(modalProp))
                } else {
                    await interaction.deferReply({ ephemeral: true })
                    if (config.ticket.type === "button") {
                        await interaction.editReply({ embeds: [getEmbedInteraction(config.ticket.messages.selectionEmbed, interaction)], components: [getTicketCategoryButtonRow(config.ticket.categories, interaction)], ephemeral: true })
                    } else if (config.ticket.type === "menu") {
                        await interaction.editReply({ embeds: [getEmbedInteraction(config.ticket.messages.selectionEmbed, interaction)], components: [getTicketCategoryMenuRow(config.ticket.categories, interaction, config.ticket.ticketCategorySelecterMenu)], ephemeral: true })
                    }
                }


            } else if (interaction.customId.startsWith(config.ticket.ticketCategorySelectionComponents.button.id)) {

                const categoryIndex = interaction.customId.split(config.ticket.ticketCategorySelectionComponents.button.id)[1]
                const category = config.ticket.categories[categoryIndex]

                let locale = interaction.locale
                if (!category[locale]) {
                    locale = config.ticket.otherLanguage
                }

                if (category[locale].requiredRoleId.length >= 1) {
                    let membersRoles = interaction.member.roles.cache.map(role => role.id);
                    const isMemberHasRole = category[locale].requiredRoleId.some(roleId => membersRoles.includes(roleId));

                    const formattedRoles = await category[locale].requiredRoleId.map(rol => `<@&${rol}>`).join(', ');

                    if (!isMemberHasRole) return await interaction.reply({ embeds: [getEmbedInteractionReplace(config.ticket.messages.doesNotHaveRequiredRole, interaction, "[roles]", formattedRoles)], ephemeral: true })
                }

                if (category[locale].questions.length > 0) {
                    askModalQuestion(category, categoryIndex)
                } else {
                    createTicket(category)
                }

            } else if (interaction.customId.startsWith(config.ticket.sendRateMessageToUserAfterTicketClosed.button.id)) {

                const customId = interaction.customId.split("-")
                const assignedStaffId = customId[1]
                const ratingOneToFive = customId[2]

                await interaction.update({ components: [getTicketRatingButtonRow(assignedStaffId, true)] })

                await interaction.channel.send({ embeds: [getEmbedInteractionReplace(config.ticket.sendRateMessageToUserAfterTicketClosed.afterRatingEmbed, interaction, "[rating]", config.ticket.sendRateMessageToUserAfterTicketClosed.button.name.repeat(ratingOneToFive))] })


                if (config.ticket.staffRankingSystem.status === true) {
                    await db.push(`staffs.allTime.${assignedStaffId}.rating`, { ticketOwner: interaction.user.id, rating: parseInt(ratingOneToFive) })
                    if (config.ticket.staffRankingSystem.dailyRanking === true) await db.push(`staffs.daily.${assignedStaffId}.rating`, { ticketOwner: interaction.user.id, rating: parseInt(ratingOneToFive) })
                    if (config.ticket.staffRankingSystem.weeklyRanking === true) await db.push(`staffs.weekly.${assignedStaffId}.rating`, { ticketOwner: interaction.user.id, rating: parseInt(ratingOneToFive) })
                    if (config.ticket.staffRankingSystem.monthlyRanking === true) await db.push(`staffs.monthly.${assignedStaffId}.rating`, { ticketOwner: interaction.user.id, rating: parseInt(ratingOneToFive) })
                }

            } else if (interaction.customId === config.ticket.closeTicket.button.id) {

                await interaction.deferUpdate()
                await closeTicket()

            } else if (interaction.customId === config.ticket.ticketAssignment.button.id) {

                await assignTicket()

            } else if (interaction.customId === config.ticket.ticketDelete.button.id) {

                await interaction.deferUpdate()
                await deleteTicket()

            } else if (interaction.customId === config.ticket.ticketReopen.button.id) {

                await interaction.deferUpdate()
                await reopenTicket()

            }

        } else if (interaction.isStringSelectMenu()) {

            if (interaction.customId === config.ticket.ticketCategorySelecterMenu.customId && interaction.values[0].startsWith(config.ticket.ticketCategorySelectionComponents.menu.id)) {

                const categoryIndex = interaction.values[0].split(config.ticket.ticketCategorySelectionComponents.menu.id)[1]
                const category = config.ticket.categories[categoryIndex]

                let locale = interaction.locale
                if (!category[locale]) {
                    locale = config.ticket.otherLanguage
                }

                if (category[locale].requiredRoleId.length >= 1) {
                    let membersRoles = interaction.member.roles.cache.map(role => role.id);
                    const isMemberHasRole = category[locale].requiredRoleId.some(roleId => membersRoles.includes(roleId));

                    const formattedRoles = await category[locale].requiredRoleId.map(rol => `<@&${rol}>`).join(', ');

                    if (!isMemberHasRole) return await interaction.reply({ embeds: [getEmbedInteractionReplace(config.ticket.messages.doesNotHaveRequiredRole, interaction, "[roles]", formattedRoles)] })
                }

                if (category[locale].questions.length > 0) {
                    askModalQuestion(category, categoryIndex)
                } else {
                    createTicket(category)
                }

            }

        } else if (interaction.isModalSubmit()) {

            if (interaction.customId.startsWith("TicketModal")) {

                const categoryIndex = interaction.customId.slice("TicketModal".length)
                const category = config.ticket.categories[categoryIndex]

                let locale = interaction.locale
                if (!category[locale]) {
                    locale = config.ticket.otherLanguage
                }

                let fields = []

                category[locale].questions.forEach((question, index) => {
                    let answer = interaction.fields.getTextInputValue("ModalQuestion" + index)
                    if (answer) {
                        fields.push({ name: `${question.label}`, value: `${answer}` })
                    }
                })

                createTicket(category, fields)

            } else if (interaction.customId === config.ticket.askHowDidYouHearUs.customId) {

                await interaction.deferReply({ ephemeral: true })

                let fields = []

                let locale = interaction.locale
                if (!config.ticket.askHowDidYouHearUs[locale]) {
                    locale = config.ticket.otherLanguage
                }
                config.ticket.askHowDidYouHearUs[locale].input.forEach((question, index) => {
                    let answer = interaction.fields.getTextInputValue(config.ticket.askHowDidYouHearUs.inputCustomId + index)
                    fields.push({ name: `${question.label}`, value: `${answer}` })
                })

                const logChannel = client.channels.cache.find(c => c.id === config.ticket.askHowDidYouHearUs.answerLogChannelId)

                let embed = new EmbedBuilder()
                    .setTitle(config.ticket.askHowDidYouHearUs[locale].title)
                fields.forEach(field => {
                    embed.addFields(
                        { name: field.name, value: field.value }
                    )
                })

                await logChannel.send({ content: `${interaction.user}`, embeds: [embed] })
                await interaction.editReply({ embeds: [getEmbedInteraction(config.ticket.askHowDidYouHearUs.embed, interaction)] })
                await db.set(`users.${interaction.user.id}.didUserOpenTicketBefore`, true)
            }

        }

    }
}