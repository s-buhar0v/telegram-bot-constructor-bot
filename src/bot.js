const TelegramBot = require('node-telegram-bot-api')
const mongoose = require('mongoose')

const settingsRepository = require('./settings-repository')
const config = require('../config')

const bot = new TelegramBot(config.botAccessToken, { polling: true });
mongoose.connect(config.connectionString)

bot.onText(/\/start/, (msg) => {
    settingsRepository.getInlineKeysByBot(config.botAccessToken, (inlineKeys) => {
        let keys = inlineKeys.map(key => [{ text: key.buttonText, callback_data: key._id }])
        let options = {
            reply_markup: JSON.stringify({
                inline_keyboard: keys
            })
        };

        bot.sendMessage(msg.chat.id, 'Welcome', options)
    })
});

bot.onText(/\.*/, (message) => {
    if (message.text != '/start') {
        settingsRepository.getOnTextAnswer(config.botAccessToken, message.text, (answer) => {
            bot.sendMessage(message.chat.id, answer.answerText || `Sorry, I don't understand you`)
        })
    }
});

bot.on('callback_query', (callbackQuery) => {
    settingsRepository.getInlineAnswerText(callbackQuery.data, answerText => {
        let options = {
            chat_id: callbackQuery.message.chat.id,
            message_id: callbackQuery.message.message_id,
        }

        bot.editMessageText(answerText, options).then(() => {
            bot.editMessageReplyMarkup(JSON.stringify({
                inline_keyboard: [
                    [{ text: 'back', callback_data: 'back' }]
                ]
            }), options)
        })
    })
})

