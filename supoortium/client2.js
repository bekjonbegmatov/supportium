const WebSocket = require('ws');
const readline = require('readline');

// Настройки клиента
const wsUrl = 'ws://10.15.91.122:8000/ws/chat/1/'; // Замените 10 на нужный room_name
const senderEmail = 'user2@user.tj';
const recipientEmail = 'user1@user.tj';

// Создаем WebSocket-соединение
const ws = new WebSocket(wsUrl);

// Чтение ввода с терминала
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Обработчик подключения
ws.on('open', () => {
    console.log('[Client 2] Подключен к серверу WebSocket.');
    console.log('Введите сообщение:');
});

// Обработчик получения сообщений
ws.on('message', (data) => {
    const message = JSON.parse(data);
    if (message.type === 'chat_message') {
        console.log(`[Client 2] Новое сообщение от ${message.sender}: ${message.message}`);
    } else if (message.type === 'chat_history') {
        console.log('[Client 2] История чата:');
        message.messages.forEach((msg) => {
            console.log(`[${msg.timestamp}] ${msg.sender} -> ${msg.recipient}: ${msg.message}`);
        });
    } else {
        console.log(`[Client 2] ${JSON.stringify(message)}`);
    }
});

// Обработчик ошибок
ws.on('error', (err) => {
    console.error('[Client 2] Ошибка:', err.message);
});

// Обработчик закрытия соединения
ws.on('close', () => {
    console.log('[Client 2] Соединение закрыто.');
    rl.close();
});

// Отправка сообщений
rl.on('line', (input) => {
    const payload = {
        sender: senderEmail,
        recipient: recipientEmail,
        message: input
    };
    ws.send(JSON.stringify(payload));
});
