const mongoose = require('mongoose')

const textMessageAnswerSchema = new mongoose.Schema({
    messageText: String,
    answerText: String,
    botAccessToken: String
})

module.exports = mongoose.model('TextMessageAnswer', textMessageAnswerSchema)