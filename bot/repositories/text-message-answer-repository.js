const axios = require('axios')

const config = require('../../config')

function getTextMessageAnswer(messageText, botId, callback) {
    axios.get(`${config.botConstructorApiUrl}/text-message-answers?botId=${botId}`).then(response => {
        let currentTextMessageAnswer = response.data.find(textMessageAnswer => textMessageAnswer.message == messageText)
        callback(currentTextMessageAnswer.answer)
    }).catch(err => {
        throw err
    })

}

module.exports.getTextMessageAnswer = getTextMessageAnswer