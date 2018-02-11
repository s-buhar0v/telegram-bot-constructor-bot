const axios = require('axios')

const config = require('../../config')

function getTextMessageAnswer(messageText, botAccessToken, callback) {
    axios.get(`${config.botConstructorApiUrl}/bot-by-token?token=${botAccessToken}`).then(response => {
        let botId = response.data.id
        axios.get(`${config.botConstructorApiUrl}/text-message-answers?botId=${botId}`).then(response => {
            let currentTextMessageAnswer = response.data.find(textMessageAnswer => textMessageAnswer.message == messageText)
            callback(currentTextMessageAnswer.answer)
        }).catch(err => {
            throw err
        })
    }).catch(err => {
        throw err
    })
}

module.exports.getTextMessageAnswer = getTextMessageAnswer