const axios = require('axios')

const config = require('../../config')


async function getInlineKeys(botId) {
    try {
        let inlineKeysResponse = await axios.get(`${config.botConstructorApiUrl}/inline-keys?botId=${botId}`)

        if (inlineKeysResponse.data) {
            return inlineKeysResponse.data
        } else {
            return []
        }
    } catch (error) {
        throw error
    }
}

function getInlineKeyAnswerText(id, botId, callback) {
    getInlineKeys(botId, keys => {
        let currentKey = keys.find(key => key.id == id)

        callback(currentKey.answer)
    })
}

module.exports.getInlineKeys = getInlineKeys
module.exports.getInlineKeyAnswerText = getInlineKeyAnswerText