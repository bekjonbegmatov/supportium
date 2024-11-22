import React, { useState, useEffect, useRef } from "react";

function ChatClient({ websocketUrl, roomName, currentUserEmail }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);

  // Прокрутка вниз при добавлении новых сообщений
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Подключение к WebSocket
  useEffect(() => {
    const socket = new WebSocket(`${websocketUrl}/ws/chat/${roomName}/`);
    setWs(socket);

    // Получение сообщений
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
          sender: msg.sender,
        }));
        setMessages(history);
      }
    };

    socket.onclose = () => console.log("WebSocket закрыт.");
    socket.onerror = (error) => console.error("WebSocket ошибка:", error);

    return () => socket.close();
  }, [websocketUrl, roomName]);

  // Отправка сообщений
  const handleSendMessage = () => {
    if (input && ws) {
      const messageData = {
        sender: currentUserEmail,
        recipient: "behruz@b.ru", // Замените на email администратора
        message: input,
      };

      ws.send(JSON.stringify(messageData)); // Отправляем сообщение через WebSocket
      setInput("");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Сообщения */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === currentUserEmail ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                message.sender === currentUserEmail
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-800"
              } p-3 rounded-lg my-1 max-w-sm`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Поле ввода */}
      <div className="sticky bottom-0 p-4 bg-white border-t shadow-sm flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="Введите сообщение..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-green-300"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}

export default ChatClient;
