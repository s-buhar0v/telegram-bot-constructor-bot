const TelegramBot = require('node-telegram-bot-api')

const config = require('../config')
const controller = require('./controller')

let bot = new TelegramBot(config.botAccessToken, { polling: true });

controller.handleStart(bot)
controller.handleTextMessage(bot)