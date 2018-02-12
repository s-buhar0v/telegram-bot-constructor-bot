const axios = require('axios')

const config = require('../../config')

async function getInterviews(botId, callback) {
    try {
        let interviewResponse = await axios.get(`${config.botConstructorApiUrl}/interviews?botId=${botId}`)

        if (!interviewResponse.data) {
            callback([])
        }

        callback(interviewResponse.data)
    } catch (error) {
        throw err
    }
}

async function getInterviewAnswers(interviewId, botId, callback) {
    try {
        let interviewResponse = await axios.get(`${config.botConstructorApiUrl}/interviews?botId=${botId}`)

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
    } catch (err) {
        throw err
    }
}

module.exports.getInterviews = getInterviews
module.exports.getInterviewAnswers = getInterviewAnswers