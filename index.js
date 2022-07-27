const TelegramABotApi = require('node-telegram-bot-api');

const {gameOptions, againOptions} = require('./options');

const token = '';

const bot = new TelegramABotApi(token, {polling: true});

const chats = {}; 

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9 ты должен ее угадать :)')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands( [
        {command: '/start', description: 'Начальное привествие' },    
        {command: '/info', description: 'Информация' },    
        {command: '/game', description: 'Игра' }    
    ])
    
    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/c62/4a8/c624a88d-1fe3-403a-b41a-3cdb9bf05b8a/3.webp')
            return bot.sendMessage(chatId, `Привет ${msg.from.first_name}, я ждала тебя `)
        }
    
        if (text === '/info') {
            await bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}, а твой адрес ТГ ${msg.from.username}`)
            return bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/c62/4a8/c624a88d-1fe3-403a-b41a-3cdb9bf05b8a/192/9.webp')
        }

        if (text === '/game') {
           return startGame(chatId);
        }
        await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/c62/4a8/c624a88d-1fe3-403a-b41a-3cdb9bf05b8a/192/10.webp')
        return bot.sendMessage(chatId, `Я тебя не понимаю ${msg.from.first_name}, попрубуй еще раз !!`)
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/c62/4a8/c624a88d-1fe3-403a-b41a-3cdb9bf05b8a/192/1.webp')
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифпу ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожелению ты не отгадал, я загадала цифру ${chats[chatId]}. Глупышка :)`, againOptions)
        }
    })
}

start();

