const interviewRepository = require('../repositories/interview-repository')
const inlineKeyboardRepository = require('../repositories/inline-keyboard-repository')
const userRepository = require('../repositories/users-repository')
const settingsRepository = require('../repositories/settings-repository')
const messageService = require('../services/message-service')

async function handleStartMessage(message, bot) {
    let user = {
        telegramId: message.from.id,
        firstName: message.from.first_name,
        lastName: message.from.last_name,
        userName: message.from.username
    }

    await userRepository.addUser(user, global.botId)
    let startMessage = await messageService.buildStartMessageMarkup()

    bot.sendMessage(
        message.chat.id, startMessage.text, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: startMessage.keys,
            }
        })
}

async function sendStartMessage(chatId, bot) {
    let startMessage = await messageService.buildStartMessageMarkup()

    bot.sendMessage(
        chatId, startMessage.text, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: startMessage.keys,
            }
        })
}


module.exports.handleStartMessage = handleStartMessage
module.exports.sendStartMessage = sendStartMessage