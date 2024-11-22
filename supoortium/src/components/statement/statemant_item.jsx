import React, { useState, useEffect } from "react";

function StatementItem(props) {
  function create_chat() {
    const roomName = props.dana.id;
    const recipientEmail = props.dana.email;
    props.onOpenChat(roomName, recipientEmail);
  }

  return (
    <div className="p-4 my-2 cursor-pointer px-8 border text-sm text-gray-800 rounded-lg bg-gray-50 flex justify-between hover:shadow-md hover:ease-in">
      <span className="border-left font-bold">{props.sanoq} </span>
      <strong>{props.dana.text}</strong>
      <strong>{props.dana.category}</strong>
      <button>{props.dana.status}</button>
      <code>
        {props.dana.created.slice(0, 10)} {props.dana.created.slice(11, 16)}
      </code>
      <button
        onClick={create_chat}
        className="text-white bg-blue-700 hover:bg-blue-800  focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 me-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Чат
      </button>
    </div>
  );
}

export default StatementItem;
