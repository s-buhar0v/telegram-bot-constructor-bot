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

async function getInlineUrlKeys() {
    try {
        let inlineKeysResponse = await axios.get(`${config.botConstructorApiUrl}/inline-url-keys?botId=${global.botId}`)

        if (inlineKeysResponse.data) {
            return inlineKeysResponse.data
        } else {
            return []
        }
    } catch (error) {
        throw error
    }
}



async function getInlineKeyAnswerText(id, callback) {
    let inlineKeys = await getInlineKeys(global.botId)
    let currentKey = inlineKeys.find(key => key.id == id)
    
    return currentKey.answer
}

module.exports.getInlineKeys = getInlineKeys
module.exports.getInlineKeyAnswerText = getInlineKeyAnswerText
module.exports.getInlineUrlKeys = getInlineUrlKeys