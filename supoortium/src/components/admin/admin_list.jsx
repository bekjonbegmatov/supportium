import React from "react";



function AdminList(props) {

    function create_chat(){
        
    }
  return (
    <div className="p-4 my-2 cursor-pointer px-8 border text-sm text-gray-800 rounded-lg bg-gray-50 flex justify-between hover:shadow-md hover:ease-in">
      <button><span className="border-left font-bold">{props.sanoq} </span></button>
      <button>
        <strong>{props.dana.text}</strong>
      </button>
      <button>
        <strong>{props.dana.category}</strong>
      </button>
      <button>{props.dana.status}</button>
      <button>
        <code>
          {props.dana.created.slice(0, 10)} {props.dana.created.slice(11, 16)}
        </code>
      </button>
      <button className="text-white bg-blue-700 hover:bg-blue-800  focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 me-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Чат
      </button>
    </div>
  );
}

export default AdminList;
