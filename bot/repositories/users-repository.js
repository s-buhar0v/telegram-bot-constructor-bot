const axios = require('axios')
const FormData = require('form-data')
const config = require('../../config')

async function addUser(user, botId) {
    try {
        let userResponse = await axios.get(`${config.botConstructorApiUrl}/users/user?telegramId=${user.telegramId}&botId=${botId}`)

        if (!userResponse.data) {
            let form = new FormData()

            form.append('telegramId', `${user.telegramId}`)
            form.append('botId', `${botId}`)
            form.append('firstName', `${user.firstName}`)
            form.append('lastName', `${user.lastName}`)
            form.append('userName', `${user.userName}`)

            await axios.post(`${config.botConstructorApiUrl}/users/add`, form, {
                headers: form.getHeaders()
            })

        }
    } catch (error) {
        throw error
    }
}

async function setNetworking(telegramId, botId, networking) {
    try {
        let form = new FormData()

        form.append('telegramId', telegramId)
        form.append('botId', botId)
        form.append('networking', networking)

        let resposne = await axios.post(`${config.botConstructorApiUrl}/users/networking/set`, form, {
            headers: form.getHeaders()
        })

        return resposne.data
    } catch (error) {
        throw error
    }
}

async function getUser(telegramId) {
    try {
        let response = await axios.get(`${config.botConstructorApiUrl}/users/user?telegramId=${telegramId}&botId=${global.botId}`)
        return response.data
    } catch (error) {
        throw error
    }
}


async function getUsers() {
    try {
        let response = await axios.get(`${config.botConstructorApiUrl}/users?botId=${global.botId}`)
        return response.data
    } catch (error) {
        throw error
    }
}
module.exports.addUser = addUser
module.exports.getUser = getUser
module.exports.getUsers = getUsers
module.exports.setNetworking = setNetworking