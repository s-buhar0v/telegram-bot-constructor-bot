function handleStart(bot) {
    bot.onText(/\/start/, (message) => {
        bot.sendMessage(message.chat.id, `Hello, I'm bot constrcutor`)
    })
}

function handleTextMessage(bot) {
    bot.onText(/\.*/, (message) => {
        if (message.text !== '/start') {
            bot.sendMessage(message.chat.id, `You sent ${message.text}`)
        }
    })
}

module.exports.handleStart = handleStart
module.exports.handleTextMessage = handleTextMessage