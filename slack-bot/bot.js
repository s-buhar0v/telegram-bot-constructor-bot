
const RtmClient = require('@slack/client').RTMClient
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS

const cognitiveService = require('../bot/services/congnitive-service')

const rtm = new RtmClient('xoxb-341539649236-rTHSYHbAwBbhGjr0ztok4iqM')

rtm.start()

rtm.on('message', async (message) => {
    const messageText = message.messageText
    const messageAnswer = await cognitiveService.findTextMessageAnswer(messageText)
    console.log(message)

    rtm.send('message', {
        channel: message.channel,
        text: 'Hello there',
        attachments: [
            {
               image_url: messageAnswer.imageUrl
            }
        ]
    })
});

