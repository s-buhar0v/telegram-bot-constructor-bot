const axios = require('axios')

const config = require('../../config')

async function getNetworkingStatus() {
    try {
        let response = await axios.get(`${config.botConstructorApiUrl}/bots/networking?id=${global.botId}`)

        return response.data
    } catch (error) {
        return false
    }
}

async function getCongnitiveServicesStatus() {
    try {
        let response = await axios.get(`${config.botConstructorApiUrl}/bots/cognitive?id=${global.botId}`)

        return response.data
    } catch (error) {
        return false
    }
}

async function getStartMessage() {
    try {
        let response = await axios.get(`${config.botConstructorApiUrl}/bots/message/?id=${global.botId}`)

        return response.data ? response.data : "Hello"
    } catch (error) {
        return false
    }
}

module.exports.getNetworkingStatus = getNetworkingStatus
module.exports.getStartMessage = getStartMessage
module.exports.getCongnitiveServicesStatus = getCongnitiveServicesStatus