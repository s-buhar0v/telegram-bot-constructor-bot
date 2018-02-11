const Interview = require('../models/interview')

function getInterviews(botAccessToken, callback) {
    Interview.find({ botAccessToken: botAccessToken }, (err, interviews) => {
        if (err) {
            throw err
        } else {
            callback(interviews)
        }
    })
}

module.exports.getInterviews = getInterviews