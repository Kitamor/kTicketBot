const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const moment = require("moment");
const config = require("../../config.js");
const db = require("quick.db");

module.exports = {
    log,
    isOwner,
    isBlacklisted,
    getModal,
    getMessageInteraction,
    getButton,
    getEmbed,
    getEmbedInteraction,
    getEmbedReplace,
    getEmbedInteractionReplace,
    getNewTicketEmbedButtonRow,
    getAfterTicketCloseEmbedButtonRow,
    getTicketRatingButtonRow,
    getTicketButtonRow,
    getTicketCategoryButtonRow,
    getTicketCategoryMenuRow,
    findChannelIdByUser,
    getAverageStaffRating
}

function log(content) {
    console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${content}`);
}

function isOwner(id) {
    return config.owners.some(oid => oid === id)
}

async function isBlacklisted(id) {
    const blacklist = await db.fetch(`blacklist`)
    let found = await blacklist.some(listed => listed === id)
    return found
}

function getModal(element) {

    if (element.input.length > 5) {
        throw new Error("EN: You can only set 5 questions. TR: Sadece 5 soru ayarlayabilirsiniz. https://kitamor.com");
    }

    const modal = new ModalBuilder()
        .setCustomId(element.customId)
        .setTitle(element.title);
    element.input.forEach((question, index) => {
        const textInputBuilder = new TextInputBuilder()
            .setCustomId(element.inputCustomId + index)
            .setLabel(question.label)
            .setPlaceholder(question.placeholder || question.label)
            .setRequired(question.required || true)
            .setStyle(question.type.toLowerCase() === "paragraph" ? TextInputStyle.Paragraph : TextInputStyle.Short)
            if (typeof question.minLength === "number") textInputBuilder.setMinLength(question.minLength)
            if (typeof question.maxLength === "number") textInputBuilder.setMaxLength(question.maxLength)
        modal.addComponents(
            new ActionRowBuilder()
                .addComponents(textInputBuilder)
        );
    })
    return modal
}

function getMessageInteraction(element, interaction) {
    var locale = interaction.locale
    if (!element[locale]) {
        var locale = config.ticket.otherLanguage
    }

    return element[locale]
}

function getButton(element) {
    let buttonRow = new ActionRowBuilder()
    let button = new ButtonBuilder()
        .setCustomId(element.id)
        .setEmoji(element.emoji)
        .setStyle(element.type)
    if (element.name != "" && element.name != null) button.setLabel(element.name)
    buttonRow.addComponents(button)

    return buttonRow
}

function getEmbed(element) {
    let embed = new EmbedBuilder()
        .setTitle(element.title)
        .setDescription(element.description)
        .setColor(element.color)
        .setFooter({ text: element.footer })
    if (element.image != "" && element.image != null && element.image != undefined && element.image != false) embed.setImage(element.image)

    return embed
}

function getEmbedInteraction(element, interaction) {
    var locale = interaction.locale
    if (!element[locale]) {
        var locale = config.ticket.otherLanguage
    }
    let embed = new EmbedBuilder()
        .setTitle(element[locale].title)
        .setDescription(element[locale].description)
        .setColor(element[locale].color)
        .setFooter({ text: element[locale].footer })
    if (element[locale].image != "" && element[locale].image != null && element[locale].image != undefined && element[locale].image != false) embed.setImage(element[locale].image)

    return embed
}

function getEmbedReplace(element, r1, r2, fields = []) {
    let embed = new EmbedBuilder()
        .setTitle(element.title.replace(r1, r2))
        .setDescription(element.description.replace(r1, r2))
        .setColor(element.color.replace(r1, r2))
        .setFooter({ text: element.footer.replace(r1, r2) })
    if (element.image != "" && element.image != null && element.image != undefined && element.image != false) embed.setImage(element.image)
    if (fields.length > 0) {
        fields.forEach(field => {
            embed.addFields(
                { name: field.name, value: field.value }
            )
        })
    }
    return embed
}

function getEmbedInteractionReplace(element, interaction, r1, r2, fields = []) {
    var locale = interaction.locale
    if (!element[locale]) {
        var locale = config.ticket.otherLanguage
    }
    let embed = new EmbedBuilder()
        .setTitle(element[locale].title.replace(r1, r2))
        .setDescription(element[locale].description.replace(r1, r2))
        .setColor(element[locale].color.replace(r1, r2))
        .setFooter({ text: element[locale].footer.replace(r1, r2) })
    if (element[locale].image != "" && element[locale].image != null && element[locale].image != undefined && element[locale].image != false) embed.setImage(element[locale].image)
    if (fields.length > 0) {
        fields.forEach(field => {
            embed.addFields(
                { name: field.name, value: field.value }
            )
        })
    }
    return embed
}

function getTicketButtonRow() {
    let buttonRow = new ActionRowBuilder()
    let button = new ButtonBuilder()
        .setCustomId(config.ticket.ticketOpenerButton.id)
        .setEmoji(config.ticket.ticketOpenerButton.emoji)
        .setStyle(config.ticket.ticketOpenerButton.type)
    if (config.ticket.ticketOpenerButton.name != "" && config.ticket.ticketOpenerButton.name != null) button.setLabel(config.ticket.ticketOpenerButton.name)
    buttonRow.addComponents(button)

    return buttonRow
}

function getNewTicketEmbedButtonRow(interaction, assignButtonDisabled = false) {
    let deleteLocale = interaction.locale
    let assignLocale = interaction.locale

    let buttonRow = new ActionRowBuilder()

    let ticketDelete = config.ticket.closeTicket
    if (!ticketDelete.button[deleteLocale]) {
        deleteLocale = config.ticket.otherLanguage
    }

    let button = new ButtonBuilder()
        .setCustomId(ticketDelete.button.id)
        .setLabel(ticketDelete.button[deleteLocale].name)
        .setStyle(ticketDelete.button[deleteLocale].type)
    if (ticketDelete.button[deleteLocale].emoji != "" && ticketDelete.button[deleteLocale].emoji != null && ticketDelete.button[deleteLocale].emoji != undefined && ticketDelete.button[deleteLocale].emoji != false) button.setEmoji(ticketDelete.button[deleteLocale].emoji)
    buttonRow.addComponents(button)

    let assignButton = config.ticket.ticketAssignment
    if (!assignButton.button[assignLocale]) {
        assignLocale = config.ticket.otherLanguage
    }
    if (assignButton.status === true) {
        let button = new ButtonBuilder()
            .setCustomId(assignButton.button.id)
            .setLabel(assignButton.button[assignLocale].name)
            .setStyle(assignButton.button[assignLocale].type)
            .setDisabled(assignButtonDisabled)
        if (assignButton.button[assignLocale].emoji != "" && assignButton.button[assignLocale].emoji != null && assignButton.button[assignLocale].emoji != undefined && assignButton.button[assignLocale].emoji != false) button.setEmoji(assignButton.button[assignLocale].emoji)
        buttonRow.addComponents(button)
    }



    return buttonRow
}

function getAfterTicketCloseEmbedButtonRow(interaction, type) {

    let ticketDelete = config.ticket.ticketDelete
    let ticketReopen = config.ticket.ticketReopen

    let deleteLocale = interaction.locale
    if (!ticketDelete.button[deleteLocale]) {
        deleteLocale = config.ticket.otherLanguage
    }

    let reopenLocale = interaction.locale
    if (!ticketDelete.button[reopenLocale]) {
        reopenLocale = config.ticket.otherLanguage
    }

    let buttonRow = new ActionRowBuilder()

    let deleteButton = new ButtonBuilder()
        .setCustomId(ticketDelete.button.id)
        .setLabel(ticketDelete.button[deleteLocale].name)
        .setStyle(ticketDelete.button[deleteLocale].type)
    if (ticketDelete.button[deleteLocale].emoji != "" && ticketDelete.button[deleteLocale].emoji != null && ticketDelete.button[deleteLocale].emoji != undefined && ticketDelete.button[deleteLocale].emoji != false) deleteButton.setEmoji(ticketDelete.button[deleteLocale].emoji)
    let reopenButton = new ButtonBuilder()
        .setCustomId(ticketReopen.button.id)
        .setLabel(ticketReopen.button[reopenLocale].name)
        .setStyle(ticketReopen.button[reopenLocale].type)
    if (ticketReopen.button[reopenLocale].emoji != "" && ticketReopen.button[reopenLocale].emoji != null && ticketReopen.button[reopenLocale].emoji != undefined && ticketReopen.button[reopenLocale].emoji != false) reopenButton.setEmoji(ticketReopen.button[reopenLocale].emoji)

    if (type === "delete") {
        buttonRow.addComponents(deleteButton)
    } else if (type === "reopen") {
        buttonRow.addComponents(reopenButton)
    } else {
        buttonRow.addComponents(deleteButton)
        buttonRow.addComponents(reopenButton)
    }

    return buttonRow
}

function getTicketRatingButtonRow(staffId, disabled = false) {
    let ticketRating = config.ticket.sendRateMessageToUserAfterTicketClosed
    let buttonRow = new ActionRowBuilder()

    for (let i = 0; i < 5; i++) {
        let button = new ButtonBuilder()
            .setCustomId(`${ticketRating.button.id}-${staffId}-${i + 1}`)
            .setLabel(ticketRating.button.name.repeat(i + 1))
            .setStyle(ticketRating.button.type)
            .setDisabled(disabled)
        buttonRow.addComponents(button)
    }

    return buttonRow
}

function getTicketCategoryButtonRow(categories, interaction) {
    let buttonRow = new ActionRowBuilder()
    categories.forEach((category, index) => {
        let locale = interaction.locale
        //if (!category[locale]) {
        if (!category[locale]) {
            locale = config.ticket.otherLanguage
        }
        let button = new ButtonBuilder()
            .setCustomId(`TicketCategoryButton${index}`)
            .setLabel(category[locale].name)
            .setStyle(category[locale].buttonType)
        if (category[locale].emoji != "" && category[locale].emoji != null && category[locale].emoji != undefined && category[locale].emoji != false) button.setEmoji(category[locale].emoji)
        buttonRow.addComponents(button)
    })

    return buttonRow
}

function getTicketCategoryMenuRow(categories, interaction, menuProperties) {
    let menuArray = []
    let locale = interaction.locale
    categories.forEach((category, index) => {
        if (!category[locale]) {
            locale = config.ticket.otherLanguage
        }
        menuArray.push(
            {
                label: category[locale].name,
                emoji: category[locale].emoji,
                description: category[locale].description,
                value: `TicketCategoryMenu${index}`,
            }
        )
    })

    let menu = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(menuProperties.customId)
                .setPlaceholder(menuProperties.placeholder[locale])
                .addOptions(menuArray)
        )

    return menu
}

async function findChannelIdByUser(uid) {
    let ticket = await db.fetch("tickets") || {};

    for (let key in ticket) {
        if (ticket[key].ticketOwnerId === uid) {
            return key
        }
    }

    return null
}

async function getAverageStaffRating(staffId, type) {
    let staffs
    switch (type) {
        case "daily":
            staffs = await db.get(`staffs.daily.${staffId}`) || {};
            break;
        case "weekly":
            staffs = await db.get(`staffs.weekly.${staffId}`) || {};
            break;
        case "monthly":
            staffs = await db.get(`staffs.monthly.${staffId}`) || {};
            break;
        case "all-time":
            staffs = await db.get(`staffs.allTime.${staffId}`) || {};
            break;
        default:
            staffs = await db.get(`staffs.allTime.${staffId}`) || {};
            break;
    }


    if (!staffs.rating || staffs.rating.length === 0) {
        return 0;
    }

    const totalRating = staffs.rating.reduce((acc, entry) => acc + entry.rating, 0);

    const averageRating = totalRating / staffs.rating.length;

    return averageRating;
}

