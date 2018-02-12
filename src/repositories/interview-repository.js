const axios = require('axios')

const config = require('../../config')

async function getInterviews(botAccessToken, callback) {
    let botResponse = await axios.get(`${config.botConstructorApiUrl}/bot-by-token?token=${botAccessToken}`)
    let interviewResponse = await axios.get(`${config.botConstructorApiUrl}/interviews?botId=${botResponse.data.id}`)

    if (!interviewResponse.data) {
        callback([])
    }

    callback(interviewResponse.data)
}

async function getInterviewAnswers(interviewId, botAccessToken, callback) {
    let botResponse = await axios.get(`${config.botConstructorApiUrl}/bot-by-token?token=${botAccessToken}`)
    let interviewResponse = await axios.get(`${config.botConstructorApiUrl}/interviews?botId=${botResponse.data.id}`)

    let interview = interviewResponse.data.find(i => i._id == interviewId)
    let answers = interview.answers.map(answer => {
        return {
            text: answer,
            interviewId: interview.id
        }
    })

    callback({
        question: interview.question,
        answers: answers
    })
}

module.exports.getInterviews = getInterviews
module.exports.getInterviewAnswers = getInterviewAnswers