const NetworkingConstants = require('./networking-constants')
const UserRepository = require('./repositories/users-repository')

let dialogs = {}

async function startDialog(message, bot) {
    if (!dialogs[message.chat.id]) {
        dialogs[message.chat.id] = {
            done: false,
            step: 0,
            userId: message.chat.id
        }

        bot.sendMessage(message.chat.id, NetworkingConstants.PHOTO_MESSAGE.text, {
            parse_mode: "HTML"
        })
    }

}

async function handleDialogMessage(message, bot) {
    let user = await UserRepository.getUser(message.chat.id)
    const dialog = dialogs[message.chat.id]
    switch (dialog.step) {
        case 0: {
            const photo = null
            if (message.photo) {
                photo = message.photo[0].file_id
            }

            await UserRepository.setNetworking(
                message.chat.id,
                global.botId,
                JSON.stringify({ photo: photo })
            )

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
    }
}

module.exports.dialogs = dialogs;
module.exports.startDialog = startDialog
module.exports.handleDialogMessage = handleDialogMessage
