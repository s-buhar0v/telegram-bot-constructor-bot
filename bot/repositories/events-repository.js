const axios = require('axios')
const FormData = require('form-data')

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
        let form = new FormData()

        form.append('id', id)

        let response = await axios.post(`${config.botConstructorApiUrl}/events/remove`, form, {
            headers: form.getHeaders()
        })

        return response.data
    } catch (error) {
        throw error
    }
}

module.exports = {
    getEvents,
    removeEvent
}