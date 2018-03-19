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

module.exports.getNetworkingStatus = getNetworkingStatus