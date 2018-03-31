module.exports = {
    INTERESTS_MESSAGE: {
        index: 1,
        text: `<strong>Что ты ищешь?\n\n[2/3]</strong>\n\nО каких темах тебе было бы интересно поговорить?`,
        userShouldSend: "interests",
    },
    PHOTO_MESSAGE: {
        index: 0,
        text: `Здесь можно познакомиться с другими пользователями бота. Расскажи о себе\n\n<strong>Фото [1/3]</strong>\n\nЗагрузи свое фото, чтобы люди знали, как ты выглядишь. Можно прислать уже сделанное фото, но я рекомендую сделать селфи прямо сейчас. Так тебя легче будет узнать. Отправь свое фото прямо сюда.`,
        userShouldSend: "photo",
    },
    USE_MESSAGE: {
        index: 2,
        text: `<strong>Чем ты можешь быть полезен?[3/3]</strong>\n\nВ каких темах ты разбираешься?`,
        userShouldSend: "use",
    }
};