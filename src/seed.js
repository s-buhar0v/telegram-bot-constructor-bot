const textMessageAnswerRepository = require('./repositories/text-message-answer-srepository')
const mongoose = require('mongoose')

mongoose.connect(require('../config').connectionString)


textMessageAnswerRepository.addTextMessageAnswer({
    messageText: 'hello',
    answerText: 'hi',
    botAccessToken: '531672624:AAHz5TO4qKY4P6Jg3aMJm8Vmm6cjLPqWPvg'
}, () => {
    console.log('callback')
})