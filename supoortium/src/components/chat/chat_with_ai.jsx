import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';

function AiChat(props) {
  const [messages, setMessages] = useState([]); // Текущий контекст сообщений
  const [input, setInput] = useState(""); // Поле ввода
  const messagesEndRef = useRef(null);

  // Прокрутка вниз
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Загрузка истории переписки с сервера
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await axios.get(`${props.server_url}/chat/with/ai/`, {
          headers: {
            Authorization: localStorage.getItem('authToken'),
          },
        });
        if (response.data) {
          setMessages(response.data); // Загружаем историю
        }
      } catch (error) {
        console.error("Ошибка загрузки истории чата:", error.response?.data || error.message);
      }
    };

    loadChatHistory();
  }, [props.server_url]);

  // Отправка нового сообщения
  const sendMessage = async () => {
    if (input.trim() === "") return; // Проверка на пустой ввод

    const userMessage = { role: "user", message: input.trim() };

    // Добавляем сообщение пользователя в текущий контекст
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      // Отправляем обновленный контекст на сервер
      const response = await axios.post(
        `${props.server_url}/chat/with/ai/`,
        { context: updatedMessages },
        {
          headers: {
            Authorization: localStorage.getItem('authToken'),
            "Content-Type": "application/json",
          },
        }
      );

      // Добавляем ответ сервера в текущий контекст
      if (response.data && response.data.assistant) {
        const assistantMessage = { role: "assistant", message: response.data.assistant };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error.response?.data || error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col ml-64">
        <br /><br /><br /><br />
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center mt-20">
            <p>История сообщений пуста. Начните диалог!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-800"
                  } p-3 rounded-lg max-w-xl`}
                >
                  <ReactMarkdown>
                {message.message}
                </ReactMarkdown>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 p-4 bg-white border-t shadow-sm flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Введите сообщение..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}

export default AiChat;
