import React, { useState, useEffect } from 'react';

function ChatBlock() {
  const [messages, setMessages] = useState([
    { text: "Добро пожаловать в Supportium я AI ассистент и готов вам помочь задавайте ваши вопросы", sender: "support" },
  ]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState(null); // Хранение WebSocket-соединения

  useEffect(() => {
    // Устанавливаем WebSocket-соединение
    const socket = new WebSocket("ws://10.15.91.122:8000/ws/chat/1/"); // Замените 10 на ваш room_name
    console.log('Conected');
    
    setWs(socket);

    // Обработчик получения сообщений
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat_message") {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.message, sender: data.sender },
        ]);
      } else if (data.type === "chat_history") {
        const history = data.messages.map((msg) => ({
          text: msg.message,
          sender: msg.sender === "user" ? "user" : "support",
        }));
        setMessages((prevMessages) => [...history, ...prevMessages]);
      }
    };

    // Обработчик закрытия соединения
    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    // Обработчик ошибок
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Отключение WebSocket при размонтировании компонента
    return () => {
      socket.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (input.length >= 1 && ws) {
      const messageData = {
        sender: "user2@user.tj", // Замените на динамический email пользователя
        recipient: "user1@user.tj", // Замените на email получателя
        message: input,
      };

      ws.send(JSON.stringify(messageData)); // Отправка сообщения через WebSocket
      setMessages([...messages, { text: input, sender: "user" }]); // Добавляем сообщение в список
      setInput("");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Сообщения */}
      <div className="flex-1 p-4 overflow-y-auto ">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center mt-20">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user2@user.tj" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    message.sender === "user2@user.tj"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-800"
                  } p-3 rounded-lg max-w-sm`}
                >
                  {message.text} {message.sender}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Поле ввода, фиксированное внизу */}
      <div className="sticky bottom-0 p-4 bg-white border-t shadow-sm flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBlock;
