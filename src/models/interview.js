const mongoose = require('mongoose')

const interview = new mongoose.Schema({
    interviewName: String,
    question: String,
    answerA: String,
    answerB: String,
    botAccessToken: String
})

module.exports = mongoose.model('Interview', interview)
