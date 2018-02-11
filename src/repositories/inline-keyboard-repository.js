const InlineKey = require('../models/inline-key')
const axios = require('axios')

const config = require('../../config')


function getInlineKeys(botAccessToken, callback) {
    InlineKey.find({ botAccessToken: botAccessToken }, (err, keys) => {
        if (err) {
            throw err
        } else {
            console.log(`[${(new Date).toISOString()}] Getting of InlineKeys`)
            callback(keys)
        }
    })
}

// function getInlineKeys(botId, callback) {
//     axios.get(`${config.botConstructorApiUrl}/bot-by-token?token=${botAccessToken}`).then(response => {
//         let botId = response.data.id
//         axios.get(`${config.botConstructorApiUrl}/bot-by-token?token=${botAccessToken}`).then(response => {
//             console.log(response.data)
//         }).catch(err => { throw err })
//     }).catch(err => { throw err })
// }

function getInlineKeyAnswerText(id, callback) {
    InlineKey.findById(id, (err, key) => {
        if (err) {
            throw err
        } else {
            callback(key.answerText)
        }
    })
}

module.exports.getInlineKeys = getInlineKeys
module.exports.getInlineKeyAnswerText = getInlineKeyAnswerText