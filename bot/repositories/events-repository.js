const axios = require('axios')

const config = require('../../config')

async function getEvents() {
    try {
        let response = await axios.get(`${config.botConstructorApiUrl}/events?botId=${global.botId}`)

        return response.data
    } catch (error) {
        throw error
    }
}

async function removeEvent(id) {
    try {
        let response = await axios.get(`${config.botConstructorApiUrl}/remove-event?id=${id}`)

        return response.data
    } catch (error) {
        throw error
    }
}

module.exports = {
    getEvents,
    removeEvent
}