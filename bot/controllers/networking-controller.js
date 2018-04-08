const NetworkingConstants = require('../resources/networking-constants')
const UserRepository = require('../repositories/users-repository')
const settingsRepositoty = require('../repositories/settings-repository')
const fileDownloadService = require('../services/file-download-service')
const azureBlobStoage = require('../repositories/azure-file-storage')

let dialogs = {}

async function startDialog(chatId, bot) {
    let networkingEnabled = await settingsRepositoty.getNetworkingStatus()
    if (networkingEnabled) {
        if (!dialogs[chatId]) {
            dialogs[chatId] = {
                done: false,
                step: 0,
                userId: chatId
            }

            bot.sendMessage(chatId, NetworkingConstants.PHOTO_MESSAGE.text, {
                parse_mode: "HTML"
            })
        }
    }

}

async function handleDialogMessage(message, bot) {
    let networkingEnabled = await settingsRepositoty.getNetworkingStatus()
    if (networkingEnabled) {
        let user = await UserRepository.getUser(message.chat.id)
        const dialog = dialogs[message.chat.id]
        switch (dialog.step) {
            case 0: {
                let photo = null
                if (message.photo) {
                    let link = await bot.getFileLink(message.photo[message.photo.length - 1].file_id)

                    fileDownloadService.downloadImage(link, user.telegramId, () => {
                        azureBlobStoage.savePhoto(user.telegramId, async (photoUrl) => {
                            await UserRepository.setNetworking(
                                message.chat.id,
                                global.botId,
                                JSON.stringify({ photoUrl: photoUrl, photoId: message.photo[message.photo.length - 1].file_id })
                            )
                        })
                    })
                }



                bot.sendMessage(message.chat.id, NetworkingConstants.INTERESTS_MESSAGE.text, {
                    parse_mode: "HTML"

                })
                break;
            }
            case 1: {
                const intersts = message.text
                let networking = JSON.parse(user.networking)
                networking.intersts = intersts

                await UserRepository.setNetworking(
                    message.chat.id,
                    global.botId,
                    JSON.stringify(networking)
                )

                bot.sendMessage(message.chat.id, NetworkingConstants.USE_MESSAGE.text, {
                    parse_mode: "HTML"
                })
                break;
            }
            case 2: {
                const use = message.text
                let networking = JSON.parse(user.networking)
                networking.use = use

                await UserRepository.setNetworking(
                    message.chat.id,
                    global.botId,
                    JSON.stringify(networking))
                dialog.done = true

                break;
            }
        }

        if (!dialog.done) {
            dialog.step++
        } else {
            delete dialogs[message.chat.id]
            let userWithNetworking = await UserRepository.getUser(message.chat.id)
            let userNetworking = JSON.parse(userWithNetworking.networking)
            let messageText = getUserProfileText(userWithNetworking)

            let reply_markup = {
                inline_keyboard: [
                    [{ text: '↩️', callback_data: JSON.stringify({ type: 'menu' }) }]
                ]
            }

            if (userNetworking.photoId) {
                bot.sendPhoto(message.chat.id, userNetworking.photoId, {
                    caption: messageText,
                    reply_markup: reply_markup,
                    parse_mode: "HTML"
                })
            } else {
                bot.sendMessage(message.chat.id, messageText, {
                    reply_markup: reply_markup,
                    parse_mode: "HTML"
                })
            }
        }
    }
}

async function sendUser(index, increment, chatId, bot) {
    let networkingEnabled = await settingsRepositoty.getNetworkingStatus()
    if (networkingEnabled) {
        let users = await UserRepository.getUsers()
        let currentUser = users[index]
        let updatedIndex = getNewIndexInCollection(index, increment, users.length)
        let messageText = getUserProfileText(currentUser)

        let userNetworking = JSON.parse(currentUser.networking)

        let reply_markup = {
            inline_keyboard: [
                [{ text: '<<', callback_data: JSON.stringify({ type: 'next', i: updatedIndex, inc: -1 }) },
                { text: '>>', callback_data: JSON.stringify({ type: 'next', i: updatedIndex, inc: 1 }) }],
                [{ text: 'Начать чат', url: `t.me/${currentUser.userName}` }],
                [{ text: '↩️', callback_data: JSON.stringify({ type: 'menu' }) }]
            ]
        }

        if (userNetworking.photoId) {
            bot.sendPhoto(chatId, userNetworking.photoId,
                {
                    reply_markup: reply_markup,
                    caption: messageText,
                    parse_mode: "HTML"
                })
        } else {
            bot.sendMessage(
                chatId,
                messageText,
                {
                    reply_markup: reply_markup,
                    parse_mode: "HTML"
                })
        }
    }
}

function getNewIndexInCollection(index, inc, length) {
    index += inc;

    if (index === length) {
        return 0;
    }

    if (index === -1) {
        return length - 1;
    }

    return index;
}

function getUserProfileText(user) {
    let userNetworking = JSON.parse(user.networking)

    return `${user.firstName} ${user.lastName}\nЯ ищу: ${userNetworking.intersts}\nЯ могу быть полезен: ${userNetworking.use}`
}

module.exports.dialogs = dialogs;
module.exports.startDialog = startDialog
module.exports.handleDialogMessage = handleDialogMessage
module.exports.sendUser = sendUser
