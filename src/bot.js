const TelegramBot = require('node-telegram-bot-api')
const mongoose = require('mongoose')

const settingsRepository = require('./repositories/settings-repository')
const config = require('../config')
const text = require('./text')

const bot = new TelegramBot(config.botAccessToken, { polling: true });

mongoose.connect(config.connectionString)

bot.onText(/\.*/, (message) => {
    if (message.text == '/start') {
        getStartMessageMarkup(markup => bot.sendMessage(message.chat.id, 'Welcome to Bot Constrcutor! http://telegra.ph/file/c6b8fbf4141b77aa326de.png', { reply_markup: markup }))
    } else {
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

    let mode = callbackQuery.data.split('_')[0]

    switch (mode) {
        case 'interview': {
            mode = ''
            let interviewId = callbackQuery.data.split('_')[1]

            settingsRepository.getInterview(interviewId, interview => {
                bot.editMessageText(interview.question, options).then(() => {
                    bot.editMessageReplyMarkup(JSON.stringify({
                        inline_keyboard: [
                            [{ text: interview.answerA, callback_data: `answer_${interview.answerA}_${interview.interviewName}` },
                            { text: interview.answerB, callback_data: `answer_${interview.answerB}_${interview.interviewName}` }],
                        ]
                    }), options)
                })
            })
            break;
        }

        case 'answer': {
            mode = ''
            let splittedCallBackData = callbackQuery.data.split('_')

            let interviewAnswer = {
                answerText: splittedCallBackData[1],
                interviewName: splittedCallBackData[2],
                botAccessToken: config.botAccessToken,
                userName: `${callbackQuery.from.first_name} ${callbackQuery.from.last_name}`
            }

            settingsRepository.addInterviewAnswer(interviewAnswer, () => {
                bot.editMessageReplyMarkup(JSON.stringify({
                    inline_keyboard: [
                        [{ text: text.backButton, callback_data: 'back' }]
                    ]
                }), options)
            })

            break;
        }

        case 'inline': {
            mode = ''
            settingsRepository.getInlineAnswerText(callbackQuery.data.split('_')[1], answerText => {
                bot.editMessageText(answerText, options).then(() => {
                    bot.editMessageReplyMarkup(JSON.stringify({
                        inline_keyboard: [
                            [{ text: text.backButton, callback_data: 'back' }]
                        ]
                    }), options)
                })
            })

            break;
        }

        case 'back': {
            mode = ''
            getStartMessageMarkup(markup => {
                bot.editMessageText('Welcome to Bot Constrcutor! http://telegra.ph/file/c6b8fbf4141b77aa326de.png', options).then(() => {
                    bot.editMessageReplyMarkup(markup, options)
                })
            })

            break;
        }
    }
})


function getStartMessageMarkup(callback) {
    settingsRepository.getInlineKeysByBot(config.botAccessToken, (inlineKeys) => {
        settingsRepository.getInterviews(config.botAccessToken, (interviews) => {
            let interviewKeys = interviews.map(interview => { return { text: interview.interviewName, callback_data: `interview_${interview._id}` } })
            let keys = inlineKeys.map(key => { return { text: key.buttonText, callback_data: `inline_${key._id}` } })

            callback(JSON.stringify({
                inline_keyboard: [keys, interviewKeys]
            }))
        })
    })
}

