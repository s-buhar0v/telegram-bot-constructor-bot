const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios')

const config = require('../config')
const controller = require('./main-controller')

let botAccessToken = process.env.BOT_ACCESS_TOKEN
let bot = new TelegramBot(botAccessToken, { polling: true });

axios.get(`${config.botConstructorApiUrl}/bot-by-token?token=${botAccessToken}`).then(response => {
    global.botId = response.data.id

    controller.handleStart(bot)
    controller.handleTextMessage(bot)
    controller.handleCallbackQuery(bot)
}).catch(err => {
    console.log(err)
    process.exit(1)
})

