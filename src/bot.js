const TelegramBot = require('node-telegram-bot-api')
const mongoose = require('mongoose')

const settingsRepository = require('./settings-repository')
const config = require('../config')

const bot = new TelegramBot(config.botAccessToken, { polling: true });
mongoose.connect(config.connectionString)

bot.onText(/\/start/, (message) => {
    getStartMessageMarkup(markup => bot.sendMessage(message.chat.id, 'Welcome', { reply_markup: markup }))
});

bot.onText(/\.*/, (message) => {
    if (message.text != '/start') {
        settingsRepository.getOnTextAnswer(config.botAccessToken, message.text, (answer) => {
            bot.sendMessage(message.chat.id, answer.answerText || `Sorry, I don't understand you`)
        })
    }
});

bot.on('callback_query', (callbackQuery) => {
    let options = {
        chat_id: callbackQuery.message.chat.id,
        message_id: callbackQuery.message.message_id,
    }

    let mode = callbackQuery.data

    if (callbackQuery.data.startsWith('i_')) {
        mode = 'interview'
    }
    if (callbackQuery.data.startsWith('a_')) {
        mode = 'answer'
    }
    if (callbackQuery.data.startsWith('inline_')) {
        mode = 'inline'
    }

    switch (mode) {
        case 'back': {
            getStartMessageMarkup(markup => {
                bot.editMessageText('Welcome', options).then(() => {
                    bot.editMessageReplyMarkup(markup, options)
                })
            })

            break;
        }

        case 'interview': {
            let interviewId = callbackQuery.data.split('_')[1]

            settingsRepository.getInterview(interviewId, interview => {
                bot.editMessageText(interview.question, options).then(() => {
                    bot.editMessageReplyMarkup(JSON.stringify({
                        inline_keyboard: [
                            [{ text: interview.answerA, callback_data: `a_${interview.answerA}_${interview.interviewName}` },
                            { text: interview.answerB, callback_data: `a_${interview.answerB}_${interview.interviewName}` }],
                        ]
                    }), options)
                })
            })

            break;
        }

        case 'answer': {
            let splittedCallBackData = callbackQuery.data.split('_')

            let interviewAnswer = {
                answerText: splittedCallBackData[1],
                interviewName: splittedCallBackData[2],
                botAccessToken: config.botAccessToken
            }

            settingsRepository.addInterviewAnswer(interviewAnswer, () => {
                bot.editMessageReplyMarkup(JSON.stringify({
                    inline_keyboard: [
                        [{ text: 'back', callback_data: 'back' }]
                    ]
                }), options)     
            })
            
            break;
        }

        case 'inline': {
            settingsRepository.getInlineAnswerText(callbackQuery.data, answerText => {
                bot.editMessageText(answerText, options).then(() => {
                    bot.editMessageReplyMarkup(JSON.stringify({
                        inline_keyboard: [
                            [{ text: 'back', callback_data: 'back' }]
                        ]
                    }), options)
                })
            })

            break;
        }
    }
})


function getStartMessageMarkup(callback) {
    settingsRepository.getInlineKeysByBot(config.botAccessToken, (inlineKeys) => {
        settingsRepository.getInterviews(config.botAccessToken, (interviews) => {
            let interviewKeys = interviews.map(interview => { return { text: interview.interviewName, callback_data: `i_${interview._id}` } })
            let keys = inlineKeys.map(key => { return { text: key.buttonText, callback_data: `inline_${key._id}` } })

            callback(JSON.stringify({
                inline_keyboard: [keys, interviewKeys]
            }))
        })

    })
}

