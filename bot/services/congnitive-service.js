const axios = require('axios')

const config = require('../../config')

axios.defaults.headers.common['Ocp-Apim-Subscription-Key'] = config.cognitiveServices.apiKey

async function findTextMessageAnswer(message) {
    try {
        let textResponse = await axios.get(`${config.cognitiveServices.webSearchHost}?q=${encodeURIComponent(message)}`)
        let imageResponse = await axios.get(`${config.cognitiveServices.imageSearchHost}?q=${encodeURIComponent(message)}`)

        return {
            answerText: `${textResponse.data.webPages.value[0].snippet}`,
            imageUrl: imageResponse.data.value[0].contentUrl
        }
    } catch (error) {
        return null
    }
}

module.exports.findTextMessageAnswer = findTextMessageAnswer






