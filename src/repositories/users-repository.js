const axios = require('axios')
const FormData = require('form-data');

const config = require('../../config')

async function addUser(user, botId, callback) {
    try {
        let userResponse = await axios.get(`${config.botConstructorApiUrl}/user?telegramId=${user.telegramId}&botId=${botId}`)


        if (!userResponse.data) {
            let form = new FormData()

            form.append('telegramId', `${user.telegramId}`)
            form.append('botId', `${botResponse.data.id}`)
            form.append('firstName', `${user.firstName}`)
            form.append('lastName', `${user.lastName}`)
            form.append('userName', `${user.userName}`)
            
            await axios.post(`${config.botConstructorApiUrl}/add-user`, form, {
                headers: form.getHeaders()
            })

            callback()
        }

        callback()
    } catch (error) {
        throw error
    }
}

module.exports.addUser = addUser