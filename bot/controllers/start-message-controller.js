const interviewRepository = require('../repositories/interview-repository')
const inlineKeyboardRepository = require('../repositories/inline-keyboard-repository')
const userRepository = require('../repositories/users-repository')
const settingsRepository = require('../repositories/settings-repository')

async function handleStartMessage(message, bot) {
    let user = {
        telegramId: message.from.id,
        firstName: message.from.first_name,
        lastName: message.from.last_name,
        userName: message.from.username
    }

    await userRepository.addUser(user, global.botId)
    let startMessage = await buildStartMessageMarkup()

    bot.sendMessage(
        message.chat.id, startMessage.text, {
            reply_markup: {
                inline_keyboard: startMessage.keys,
                parse_mode: "HTML"
            }
        })
}

async function buildStartMessageMarkup(callback) {
    const inlineKeys = await inlineKeyboardRepository.getInlineKeys(global.botId)
    const interviews = await interviewRepository.getInterviews(global.botId)
    const networkingEnabled = await settingsRepository.getNetworkingStatus()
    let keys = []

    inlineKeys.forEach(key => {
        keys.push([{
            text: key.caption,
            callback_data: JSON.stringify({
                id: key.id,
                type: 'inline'
            })
        }])
    })

    interviews.forEach(interview => {
        keys.push([{
            text: interview.name,
            callback_data: JSON.stringify({
                id: interview.id,
                type: 'interview'
            })
        }])
    })


    if (networkingEnabled) {
        keys.push([{
            text: 'Нетворкинг',
            callback_data: JSON.stringify({
                type: 'networking'
            })
        }])
    }

    return {
        text: `Hello, I'm telegram bot constrcutor by MSP`,
        keys: keys
    }
}

module.exports.handleStartMessage = handleStartMessage