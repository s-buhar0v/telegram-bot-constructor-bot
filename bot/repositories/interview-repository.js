const axios = require('axios')
const FormData = require('form-data');

const config = require('../../config')

async function getInterviews(botId) {
    try {
        let interviewResponse = await axios.get(`${config.botConstructorApiUrl}/interviews?botId=${botId}`)

        if (interviewResponse.data) {
            return interviewResponse.data
        } else {
            return []
        }
    } catch (error) {
        throw error
    }
}

async function getInterviewAnswers(interviewId, botId, callback) {
    try {
        let interviewResponse = await axios.get(`${config.botConstructorApiUrl}/interviews?botId=${botId}`)
        
        let interview = interviewResponse.data.find(i => i.id == interviewId)
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

async function addInterviewAnswer(interviewId, userId, answerIndex, botId, callback) {
    try {
        let interviewResponse = await axios.get(`${config.botConstructorApiUrl}/interview?id=${interviewId}`)

        let form = new FormData()

        form.append('interviewId', `${interviewId}`)
        form.append('userId', `${userId}`)
        form.append('answer', `${interviewResponse.data.answers[answerIndex]}`)
        form.append('botId', `${botId}`)

        await axios.post(`${config.botConstructorApiUrl}/add-interview-answer`, form, {
            headers: form.getHeaders()
        })

        callback()
    } catch (error) {
        throw error
    }
}

async function isIterviewAnswerAlreadyExists(interviewId, botId, userId, callback) {
    try {
        let interviewAnswersResponse = await axios.get(`${config.botConstructorApiUrl}/interview-answers?botId=${botId}`)

        let answer = interviewAnswersResponse.data.find(answer => {
            return answer.interviewId == interviewId && answer.userId == userId
        })

        callback(answer != null)
    } catch (error) {
        throw error
    }
}

module.exports.getInterviews = getInterviews
module.exports.getInterviewAnswers = getInterviewAnswers
module.exports.addInterviewAnswer = addInterviewAnswer
module.exports.isIterviewAnswerAlreadyExists = isIterviewAnswerAlreadyExists