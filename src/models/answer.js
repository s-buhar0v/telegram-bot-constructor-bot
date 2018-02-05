const mongoose = require('mongoose')

const answer = new mongoose.Schema({
    interviewName: String,
    answerText: String,
    botAccessToken: String
})

module.exports = mongoose.model('Answer', answer)
