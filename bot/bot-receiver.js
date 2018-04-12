const schedule = require("node-schedule")
const eventsRepository = require("./repositories/events-repository")
const userRepositorty = require("./repositories/users-repository");

async function start(bot) {
    schedule.scheduleJob("*/1 * * * *", async () => {
        const events = await eventsRepository.getEvents();
        const userEvents = await eventsRepository.getUserEvents();
        const users = await userRepositorty.getUsers();

        events.forEach(event => {
            eventsRepository.removeEvent(event.id);
            users.forEach(user => {
                bot.sendMessage(user.telegramId, event.text, {
                    parse_mode: "Markdown"
                });
            });
        });

        userEvents.forEach(event => {
            eventsRepository.removeUserEvent(event.id)
            bot.sendMessage(event.userTelegramId, event.text, {
                parse_mode: "Markdown"
            });
        })
    });
}

module.exports.start = start;

