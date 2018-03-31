const axios = require('axios')

const config = require('../../config')

async function getNetworkingStatus() {
    try {
        let response = await axios.get(`${config.botConstructorApiUrl}/bot-networking?id=${global.botId}`)

        return response.data
    } catch (error) {
        return false
    }
}

async function getStartMessage() {
    try {
        let response = await axios.get(`${config.botConstructorApiUrl}/get-start-message?id=${global.botId}`)

        return response.data ? response.data : "Hello"
    } catch (error) {
        return false
    }
}

module.exports.getNetworkingStatus = getNetworkingStatus
module.exports.getStartMessage = getStartMessage