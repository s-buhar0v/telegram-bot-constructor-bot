const TelegramBot = require('node-telegram-bot-api')
const mongoose = require('mongoose')

const config = require('../config')
const controller = require('./main-controller')

let bot = new TelegramBot(config.botAccessToken, { polling: true });
mongoose.connect(config.connectionString)

controller.handleStart(bot)
controller.handleTextMessage(bot)
controller.handleCallbackQuery(bot)