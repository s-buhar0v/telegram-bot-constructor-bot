const OnTextAnswer = require('./models/on-text-answer')
const InlinKey = require('./models/inline-key')
const Interview = require('./models/interview')

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

function getInterviews(botAccessToken, callback) {
    Interview.find({ botAccessToken: botAccessToken }, (err, interviews) => callback(interviews))
}

function getInterview(id, callback) {
    Interview.findById(id , (err, interview) => callback(interview))
}

module.exports.getOnTextAnswer = getOnTextAnswer
module.exports.getInlineKeysByBot = getInlineKeysByBot
module.exports.getInlineAnswerText = getInlineAnswerText
module.exports.getInterviews = getInterviews
module.exports.getInterview = getInterview