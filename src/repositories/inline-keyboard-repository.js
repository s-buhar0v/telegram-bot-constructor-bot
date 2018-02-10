const InlineKey = require('../models/inline-key')

function getInlineKeys(botAccessToken, callback) {
    InlineKey.find({ botAccessToken: botAccessToken }, (err, keys) => {
        if (err) {
            throw err
        } else {
            console.log(`[${(new Date).toISOString()}] Getting of InlineKeys`)
            callback(keys)
        }
    })
}

function getInlineKeyAnswerText(id, callback) {
    InlineKey.findById(id, (err, key) => {
        if (err) {
            throw err
        } else {
            callback(key.answerText)
        }
    })
}

module.exports.getInlineKeys = getInlineKeys
module.exports.getInlineKeyAnswerText = getInlineKeyAnswerText