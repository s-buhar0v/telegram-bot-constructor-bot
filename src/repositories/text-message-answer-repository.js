const TextMessageAnswer = require('../models/text-message-answer')

function addTextMessageAnswer(textMessageAnswer, callback) {
    let newTextMessageAnswer = new TextMessageAnswer(textMessageAnswer)

    newTextMessageAnswer.save((err) => {
        if (err) {
            throw err
        } else {
            console.log(`[${(new Date).toISOString()}] New TextMessageAnswer has been added`)
            callback()
        }
    })
}

function getTextMessageAnswer(messageText, botAccessToken, callback) {
    TextMessageAnswer.findOne(
        {
            messageText: messageText,
            botAccessToken: botAccessToken
        }, (err, textMessageAnswer) => {
            if (err) {
                throw err
            } else {
                console.log(`[${(new Date).toISOString()}] Getting of TextMessageAnswer`)
                if (textMessageAnswer) {
                    callback(textMessageAnswer.answerText)
                } else {
                    callback(null)
                }
            }
        })
}

module.exports.addTextMessageAnswer = addTextMessageAnswer
module.exports.getTextMessageAnswer = getTextMessageAnswer