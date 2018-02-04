const mongoose = require('mongoose')

const onTextAnswer = new mongoose.Schema({
    messageText: String,
    answerText: String,
    botAccessToken: String
})

module.exports = mongoose.model('OnTextAnswer', onTextAnswer)