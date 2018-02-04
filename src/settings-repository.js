const OnTextAnswer = require('./models/on-text-answer')

function getOnTextAnswer(botAccessToken, messageText, callback) {
    OnTextAnswer.findOne({ botAccessToken: botAccessToken, messageText: messageText }, (err, answer) => {
        callback(answer)
    })
}

module.exports.getOnTextAnswer = getOnTextAnswer