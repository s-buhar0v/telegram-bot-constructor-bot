const axios = require('axios')

const config = require('../../config')

function getTextMessageAnswer(messageText, botId, callback) {
    axios.get(`${config.botConstructorApiUrl}/text-message-answers?botId=${botId}`).then(response => {
        if (response.data.length > 0) {
            let currentTextMessageAnswer = response.data.find(textMessageAnswer => textMessageAnswer.message == messageText)
            callback(currentTextMessageAnswer.answer)
        } else {
            callback(null)
        }
    }).catch(err => {
        throw err
    })

}

module.exports.getTextMessageAnswer = getTextMessageAnswer