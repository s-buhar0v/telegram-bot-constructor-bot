const interviewRepository = require('../repositories/interview-repository')
const inlineKeyboardRepository = require('../repositories/inline-keyboard-repository')
const settingsRepository = require('../repositories/settings-repository')

async function buildStartMessageMarkup() {
    const inlineKeys = await inlineKeyboardRepository.getInlineKeys(global.botId)
    const inlineUrlKeys = await inlineKeyboardRepository.getInlineUrlKeys()
    const interviews = await interviewRepository.getInterviews(global.botId)
    const networkingEnabled = await settingsRepository.getNetworkingStatus()
    const messageText = await settingsRepository.getStartMessage()

    let keys = []

    inlineKeys.forEach(key => {
        keys.push([{
            text: key.caption,
            callback_data: JSON.stringify({
                id: key.id,
                type: 'inline'
            })
        }])
    })

    interviews.forEach(interview => {
        keys.push([{
            text: interview.name,
            callback_data: JSON.stringify({
                id: interview.id,
                type: 'interview'
            })
        }])
    })

    inlineUrlKeys.forEach(urlKey => {
        keys.push([{
            text: urlKey.caption,
            url: urlKey.url
        }])
    })


    if (networkingEnabled) {
        keys.push([{
            text: 'Нетворкинг',
            callback_data: JSON.stringify({
                type: 'networking'
            })
        }])
    }

    return {
        text: messageText,
        keys: keys
    }
}

module.exports.buildStartMessageMarkup = buildStartMessageMarkup