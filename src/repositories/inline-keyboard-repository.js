const axios = require('axios')

const config = require('../../config')


async function getInlineKeys(botId, callback) {
    try {
        let inlineKeysResponse = await axios.get(`${config.botConstructorApiUrl}/inline-keys?botId=${botId}`)

        if (!inlineKeysResponse.data) {
            callback([])
        }

        callback(inlineKeysResponse.data)
    } catch (error) {
        throw error
    }
}

function getInlineKeyAnswerText(id, botId, callback) {
    getInlineKeys(botId, keys => {
        let currentKey = keys.find(key => key._id == id)

        callback(currentKey.answer)
    })
}

module.exports.getInlineKeys = getInlineKeys
module.exports.getInlineKeyAnswerText = getInlineKeyAnswerText