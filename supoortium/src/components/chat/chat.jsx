import React, { useState, useEffect, useRef } from "react";

function ChatBlock({ websocketUrl, recipientEmail }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);

  const currentUser = "behruz@b.ru"; // Укажите email администратора

  // Прокрутка вниз при новом сообщении
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
    const socket = new WebSocket(websocketUrl);
    setWs(socket);

    // Получение данных
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

    // Закрытие WebSocket
    socket.onclose = () => console.log("WebSocket закрыт.");
    socket.onerror = (error) => console.error("WebSocket ошибка:", error);

    return () => socket.close();
  }, [websocketUrl]);

  // Отправка сообщения
  const handleSendMessage = () => {
    if (input && ws) {
      const messageData = {
        sender: currentUser,
        recipient: recipientEmail,
        message: input,
      };

      ws.send(JSON.stringify(messageData)); // Отправляем через WebSocket
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
              message.sender === currentUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`${
                message.sender === currentUser
                  ? "bg-blue-500 text-white"
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
          placeholder="Напишите сообщение..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}

export default ChatBlock;
