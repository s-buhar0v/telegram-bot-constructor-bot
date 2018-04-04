const congnitiveService = require('../services/congnitive-service')

async function handleMessage(chatId, text, bot) {
    const cognitiveTextMessageAnswer = await congnitiveService.findTextMessageAnswer(text)

    if (cognitiveTextMessageAnswer) {
        bot.sendPhoto(chatId, cognitiveTextMessageAnswer.imageUrl, {
            caption: `${cognitiveTextMessageAnswer.answerText}`,
            parse_mode: "HTML"
        })
    }
}

module.exports.handleMessage = handleMessage