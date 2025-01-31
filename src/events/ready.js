const { ActivityType } = require("discord.js");
const { activity } = require("../../config.js");

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        let i = 0;
        setInterval(() => client.user.setActivity({ name: `${activity.text[i++ % activity.text.length]}`, state: `${activity.text[i++ % activity.text.length]}`, type: ActivityType.Custom }), activity.interval * 60000);
    }
};