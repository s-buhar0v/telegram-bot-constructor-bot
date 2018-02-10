const textMessageAnswerRepository = require('./repositories/text-message-answer-repository')
const inlineKeyboardRepository = require('./repositories/inline-keyboard-repository')
const config = require('../config')

function handleStart(bot) {
    bot.onText(/\/start/, (message) => {
        getStartMessage((text, keys) => {
            bot.sendMessage(
                message.chat.id, text, {
                    reply_markup: {
                        inline_keyboard: [keys]
                    }
                })
        })
    })
}

function handleTextMessage(bot) {
    bot.onText(/\.*/, (message) => {
        if (message.text !== '/start') {
            textMessageAnswerRepository.getTextMessageAnswer(
                message.text,
                config.botAccessToken,
                textMessageAnswer => {
                    if (textMessageAnswer) { bot.sendMessage(message.chat.id, textMessageAnswer) }
                })
        }
    })
}

function handleCallbackQuery(bot) {
    bot.on('callback_query', callbackData => {
        let parsedCallbackData = JSON.parse(callbackData.data)
        let type = parsedCallbackData.type

        let options = {
            chat_id: callbackData.message.chat.id,
            message_id: callbackData.message.message_id,
        }

        switch (type) {
            case 'inline': {
                inlineKeyboardRepository.getInlineKeyAnswerText(parsedCallbackData.id, asnwerText => {
                    bot.editMessageText(asnwerText, options).then(() => {
                        bot.editMessageReplyMarkup(JSON.stringify({
                            inline_keyboard: [
                                [{ text: '↩️', callback_data: JSON.stringify({ type: 'back' }) }]
                            ]
                        }), options)
                    })
                })
            }
            case 'back': {
                getStartMessage((text, keys) => {
                    bot.editMessageText(text, options).then(() => {
                        bot.editMessageReplyMarkup(JSON.stringify({
                            inline_keyboard: [keys]
                        }), options)
                    })
                })
            }
        }
    })
}

function getStartMessage(callback) {
    inlineKeyboardRepository.getInlineKeys(config.botAccessToken, keys => {
        let inlineKeyBoard = keys.map(key => {
            return {
                text: key.buttonText,
                callback_data: JSON.stringify({
                    id: key._id,
                    type: 'inline'
                })
            }
        })
        callback(`Hello, I'm bot constrcutor`, inlineKeyBoard)
    })
}

module.exports.handleStart = handleStart
module.exports.handleTextMessage = handleTextMessage
module.exports.handleCallbackQuery = handleCallbackQuery