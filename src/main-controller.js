const textMessageAnswerRepository = require('./repositories/text-message-answer-repository')
const inlineKeyboardRepository = require('./repositories/inline-keyboard-repository')
const interviewRepository = require('./repositories/interview-repository')
const userRepository = require('./repositories/users-repository')
const config = require('../config')

function handleStart(bot) {
    bot.onText(/\/start/, (message) => {
        let user = {
            telegramId: message.from.id,
            firstName: message.from.first_name,
            lastName: message.from.last_name,
            userName: message.from.username
        }

        userRepository.addUser(user, config.botAccessToken, () => {
            buildStartMessageMarkup((text, keys) => {
                bot.sendMessage(
                    message.chat.id, text, {
                        reply_markup: {
                            inline_keyboard: keys
                        }
                    })
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
                inlineKeyboardRepository.getInlineKeyAnswerText(parsedCallbackData.id, config.botAccessToken, asnwerText => {
                    bot.editMessageText(asnwerText, options).then(() => {
                        bot.editMessageReplyMarkup(JSON.stringify({
                            inline_keyboard: [
                                [{ text: '↩️', callback_data: JSON.stringify({ type: 'back' }) }]
                            ]
                        }), options)
                    })
                })
                break
            }
            case 'interview': {
                interviewRepository.getInterviewAnswers(parsedCallbackData.id, config.botAccessToken, interviewAnswers => {
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
                break
            }
            case 'back': {
                buildStartMessageMarkup((text, keys) => {
                    bot.editMessageText(text, options).then(() => {
                        bot.editMessageReplyMarkup(JSON.stringify({
                            inline_keyboard: keys
                        }), options)
                    })
                })
                break
            }
        }
    })
}

function buildStartMessageMarkup(callback) {
    inlineKeyboardRepository.getInlineKeys(config.botAccessToken, keys => {
        interviewRepository.getInterviews(config.botAccessToken, interviews => {
            let inlineKeyBoard = keys.map(key => {
                return {
                    text: key.caption,
                    callback_data: JSON.stringify({
                        id: key._id,
                        type: 'inline'
                    })
                }
            })

            let interviewKeyBoard = interviews.map(interview => {
                return {
                    text: interview.name,
                    callback_data: JSON.stringify({
                        id: interview._id,
                        type: 'interview'
                    })
                }
            })

            callback(`Hello, I'm bot constrcutor`, [inlineKeyBoard, interviewKeyBoard])
        })
    })
}

function buildInterviewMessageMarkup(answers) {
    return answers.map(answer => {
        return {
            text: answer.text,
            callback_data: JSON.stringify({
                type: 'answer',
                id: answer.interviewId
            })
        }
    })
}

module.exports.handleStart = handleStart
module.exports.handleTextMessage = handleTextMessage
module.exports.handleCallbackQuery = handleCallbackQuery