import React, { useState } from "react";
import StatusButton from "./status_button";
import axios from "axios";

function AdminList(props) {
  const [edit, setEdit] = useState(false);
    const [new_status, setNewstatus] = useState(props.dana.status)
  function create_chat() {
    const roomName = props.dana.id;
    const recipientEmail = props.dana.email;
    props.onOpenChat(roomName, recipientEmail);
  }
  const statusMapping = {
    PENDING: { status_en: "PENDING", status_ru: "Ещё не принято" },
    IN_PROGRESS: { status_en: "IN_PROGRESS", status_ru: "В процессе" },
    RESOLVED: { status_en: "RESOLVED", status_ru: "Решено" },
    CLOSED: { status_en: "CLOSED", status_ru: "Закрыто" },
  };

  function save(){
    if (new_status == props.dana.status){
        setEdit(false)
    }else{
        const token = localStorage.getItem('authToken'); 
        const requestData = {
          data: {
            id: props.dana.id,
            status: new_status, 
            description: props.dana.text, 
          },
        };
        try {
          const response = axios.put(`${props.server_url}/user/request`, requestData, {
            headers: {
              Authorization: `${token}`,
              'Content-Type': 'application/json',
            },
          });
          setEdit(false)
          window.location.reload()
          console.log('Ответ сервера:', response.data);
        } catch (error) {
          if (error.response) {
            console.error('Ошибка:', error.response.data);
          } else {
            console.error('Ошибка:', error.message);
          }
        }
    }
  }
  return (
    <div className="">
      <div className="p-4 my-2 cursor-pointer px-8 border text-sm text-gray-800 rounded-lg bg-gray-50 flex justify-between corsor-pointer hover:shadow-md hover:corsor-pointer hover:ease-in">
        <button>
          <span className="border-left font-bold">{props.sanoq} </span>
        </button>
        <button>
          <span className="border-left font-bold">{props.dana.email} </span>
        </button>
        <button>
          <strong>{props.dana.text}</strong>
        </button>
        <button>
          <strong>{props.dana.category}</strong>
        </button>
        {edit ? (
          <div>
            <select value={new_status} onChange={(e) => {setNewstatus(e.target.value)}} name="status" id="status-select">
              {Object.values(statusMapping).map((val, i) => (
                <option key={i} value={val.status_en}>
                  {val.status_ru}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <StatusButton status={props.dana.status} />
        )}

        <button>
          <code>
            {props.dana.created.slice(0, 10)} {props.dana.created.slice(11, 16)}
          </code>
        </button>
        <button
          onClick={create_chat}
          className="text-white bg-blue-700 hover:bg-blue-800  focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 me-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Чат
        </button>

        {edit ? (
            <button onClick={save}
            className="text-white bg-blue-700 hover:bg-blue-800  focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 me-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >Сохранить</button>
        ) : (
            <button
            onClick={() => {
              setEdit(true);
            }}
            className="text-white bg-blue-700 hover:bg-blue-800  focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 me-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Изменить Статус
          </button>
        )}


      </div>
    </div>
  );
}

export default AdminList;
