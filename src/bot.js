const TelegramBot = require('node-telegram-bot-api')
const mongoose = require('mongoose')

const settingsRepository = require('./settings-repository')
const config = require('../config')

const bot = new TelegramBot(config.botAccessToken, { polling: true });
mongoose.connect(config.connectionString)

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Welcome')
});

bot.onText(/\.*/, (message) => {
    if (message.text != '/start') {
        settingsRepository.getOnTextAnswer(config.botAccessToken, message.text, (answer) => {
            bot.sendMessage(message.chat.id, answer.answerText || `Sorry, I don't understand you`)
        })
    }
});

