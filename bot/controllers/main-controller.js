const textMessageAnswerRepository = require('../repositories/text-message-answer-repository')
const inlineKeyboardRepository = require('../repositories/inline-keyboard-repository')
const interviewRepository = require('../repositories/interview-repository')
const userRepository = require('../repositories/users-repository')
const congnitiveService = require('../services/congnitive-service')
const messageService = require('../services/message-service')
const textConstants = require('../resources/text-constants')
const config = require('../../config')
const UserRepository = require('../repositories/users-repository')
const settingsRepository = require('../repositories/settings-repository')

const startMessageController = require('./start-message-controller')
const networkingController = require('./networking-controller')

async function handleStart(bot) {
    bot.onText(/\/start/, async (message) => {
        await startMessageController.handleStartMessage(message, bot)
    })
}

function handleTextMessage(bot) {
    bot.on('message', async (message) => {
        if (message.text !== '/start') {
            if (!networkingController.dialogs[message.chat.id]) {
                textMessageAnswerRepository.getTextMessageAnswer(
                    message.text,
                    global.botId,
                    textMessageAnswer => {
                        if (textMessageAnswer) {
                            bot.sendMessage(message.chat.id, textMessageAnswer, {
                                parse_mode: "HTML"
                            })
                        } else {
                            bot.sendMessage(message.chat.id, textConstants.notFoundMessage)
                            congnitiveService.findTextMessageAnswer(message.text, (cognitiveTextMessageAnswer) => {
                                if (cognitiveTextMessageAnswer) {
                                    bot.sendPhoto(message.chat.id, cognitiveTextMessageAnswer.imageUrl, {
                                        caption: `${cognitiveTextMessageAnswer.answerText}`,
                                        parse_mode: "HTML"
                                    })
                                }
                            })
                        }
                    })
            } else {
                networkingController.handleDialogMessage(message, bot)
            }
        }
    })
}

function handleCallbackQuery(bot) {
    bot.on('callback_query', async (callbackData) => {
        let parsedCallbackData = JSON.parse(callbackData.data)
        let type = parsedCallbackData.type

        let options = {
            chat_id: callbackData.message.chat.id,
            message_id: callbackData.message.message_id,
            parse_mode: "HTML"
        }

        switch (type) {
            case 'inline': {
                let answerText = await inlineKeyboardRepository.getInlineKeyAnswerText(parsedCallbackData.id)
                
                bot.editMessageText(answerText, options).then(() => {
                    setMessageWithReturnButton(bot, options)
                })
                break
            }
            case 'interview': {
                interviewRepository.isIterviewAnswerAlreadyExists(
                    parsedCallbackData.id,
                    global.botId,
                    callbackData.from.id, isExists => {
                        if (!isExists) {
                            interviewRepository.getInterviewAnswers(parsedCallbackData.id, global.botId, interviewAnswers => {
                                let answerKeys = buildInterviewMessageMarkup(interviewAnswers.answers)

                                bot.editMessageText(interviewAnswers.question, options).then(() => {
                                    bot.editMessageReplyMarkup(JSON.stringify({
                                        inline_keyboard: [
                                            answerKeys,
                                            [{ text: '↩️', callback_data: JSON.stringify({ type: 'back' }) }]
                                        ]
                                    }), options)
                                })
                            })
                        } else {
                            setMessageWithReturnButton(bot, options)
                        }
                    })
                break
            }
            case 'answer': {
                interviewRepository.isIterviewAnswerAlreadyExists(
                    parsedCallbackData.id,
                    global.botId,
                    callbackData.from.id, isExists => {
                        if (!isExists) {
                            interviewRepository.addInterviewAnswer(
                                parsedCallbackData.id,
                                callbackData.from.id,
                                parsedCallbackData.answer,
                                global.botId, () => {
                                    setMessageWithReturnButton(bot, options)
                                })
                        }
                    })
                break
            }
            case 'networking': {
                let user = await UserRepository.getUser(callbackData.message.chat.id)
                let userNetworking = JSON.parse(user.networking)
                if (Object.keys(userNetworking).length === 0) {
                    networkingController.startDialog(callbackData.message.chat.id, bot)
                } else {
                    networkingController.sendUser(0, 1, callbackData.message.chat.id, bot)
                }
                break
            }
            case 'next': {
                networkingController.sendUser(parsedCallbackData.i, parsedCallbackData.inc, callbackData.message.chat.id, bot)
                break
            }
            case 'menu': {
                await startMessageController.sendStartMessage(callbackData.message.chat.id, bot)
                break
            }
            case 'back': {
                let startMessage = await messageService.buildStartMessageMarkup()

                bot.editMessageText(startMessage.text, options).then(() => {
                    bot.editMessageReplyMarkup(JSON.stringify({
                        inline_keyboard: startMessage.keys
                    }), options)
                })
                break
            }
        }
    })
}

function buildInterviewMessageMarkup(answers) {
    return answers.map((answer, index) => {
        return {
            text: answer.text,
            callback_data: JSON.stringify({
                type: 'answer',
                id: answer.interviewId,
                answer: index
            })
        }
    })
}

function setMessageWithReturnButton(bot, options) {
    bot.editMessageReplyMarkup(JSON.stringify({
        inline_keyboard: [
            [{ text: '↩️', callback_data: JSON.stringify({ type: 'back' }) }]
        ]
    }), options)
}

module.exports.handleStart = handleStart
module.exports.handleTextMessage = handleTextMessage
module.exports.handleCallbackQuery = handleCallbackQuery