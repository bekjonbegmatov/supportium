import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminList from "./admin_list";

import ChatBlock from "../chat/chat";

function Admin(props) {
  const [requests, setRequests] = useState();
  const [loaded, setLoaded] = useState(false);

  const [chatData, setChatData] = useState(null); // Данные чата

  const handleOpenChat = (roomName, recipientEmail) => {
    setChatData({ roomName, recipientEmail }); // Сохраняем данные чата
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Запрос запросов пользователя
        const requestResponse = await axios.get(
          `${props.server_url}/user/request`,
          {
            headers: {
              Authorization: localStorage.getItem("authToken"),
            },
          }
        );
        setRequests(requestResponse.data);

        // Устанавливаем флаг завершения загрузки
        setLoaded(true);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 size-full  rounded-lg mt-14">
        {loaded && (
          <div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">
                Обращение
              </h1>
              <br />
              {requests?.map((val, i) => {
                return (
                  <AdminList onOpenChat={handleOpenChat} className="" key={i} sanoq={i + 1} dana={val} />
                );
              })}
            </div>
            {chatData && (
                <ChatBlock websocketUrl={`${props.wecoket_url}/ws/chat/${chatData.roomName}/`} recipientEmail={chatData.recipientEmail} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
