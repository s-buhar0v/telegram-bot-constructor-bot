const OnTextAnswer = require('./models/on-text-answer')
const InlinKey = require('./models/inline-key')

function getOnTextAnswer(botAccessToken, messageText, callback) {
    OnTextAnswer.findOne({ botAccessToken: botAccessToken, messageText: messageText }, (err, answer) => {
        callback(answer)
    })
}

function getInlineKeysByBot(botAccessToken, callback) {
    InlinKey.find({ botAccessToken: botAccessToken }, (err, buttons) => {
        callback(buttons)
    })
}

function getInlineAnswerText(id, callback) {
    InlinKey.findById(id, (err, key) => callback(key.answerText))
}

module.exports.getOnTextAnswer = getOnTextAnswer
module.exports.getInlineKeysByBot = getInlineKeysByBot
module.exports.getInlineAnswerText = getInlineAnswerText