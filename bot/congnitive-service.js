const axios = require('axios')

const config = require('../config')

axios.defaults.headers.common['Ocp-Apim-Subscription-Key'] = config.cognitiveServices.apiKey

function findTextMessageAnswer(message, callback) {
    axios.get(`${config.cognitiveServices.webSearchHost}?q=${encodeURIComponent(message)}`).then(textResponse => {
        axios.get(`${config.cognitiveServices.imageSearchHost}?q=${encodeURIComponent(message)}`).then(imageResponse => {
            callback({
                answerText: `${textResponse.data.webPages.value[0].snippet}`,
                imageUrl: imageResponse.data.value[0].contentUrl
            })
        }).catch(err => callback(null))
    }).catch(err => callback(null))
}

module.exports.findTextMessageAnswer = findTextMessageAnswer






