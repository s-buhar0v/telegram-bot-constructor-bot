const InlineKey = require('../models/inline-key')
const axios = require('axios')

const config = require('../../config')


async function getInlineKeys(botAccessToken, callback) {
    try {
        let botResponse = await axios.get(`${config.botConstructorApiUrl}/bot-by-token?token=${botAccessToken}`)
        let inlineKeysResponse = await axios.get(`${config.botConstructorApiUrl}/inline-keys?botId=${botResponse.data.id}`)

        if (!inlineKeysResponse.data) {
            callback([])
        }

        callback(inlineKeysResponse.data)
    } catch (error) {
        throw error
    }
}

function getInlineKeyAnswerText(id, botAccessToken, callback) {
    getInlineKeys(botAccessToken, keys => {
        let currentKey = keys.find(key => key._id == id)

        callback(currentKey.answer)
    })
}

module.exports.getInlineKeys = getInlineKeys
module.exports.getInlineKeyAnswerText = getInlineKeyAnswerText