const mongoose = require('mongoose')

const answer = new mongoose.Schema({
    interviewName: String,
    answerText: String,
    botAccessToken: String,
    userName: String
})

module.exports = mongoose.model('Answer', answer)
