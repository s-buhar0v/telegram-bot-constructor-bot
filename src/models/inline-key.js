const mongoose = require('mongoose')

const inlineKey = new mongoose.Schema({
    buttonText: String,
    answerText: String,
    botAccessToken: String
})

module.exports = mongoose.model('InlineKey', inlineKey)
