const TelegramBot = require('node-telegram-bot-api');

const token = '531672624:AAHz5TO4qKY4P6Jg3aMJm8Vmm6cjLPqWPvg';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, 'Welcome')

});

bot.onText(/\.*/, (message) => {
    if (message.text != '/start') {
        bot.sendMessage(message.chat.id, 'Received your message')
    }
});

