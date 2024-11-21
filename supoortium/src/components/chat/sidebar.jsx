import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-mod.png";

function Sidebar() {
    const [messages, setMessages] = useState([
        { text: "Welcome to Supportium!", sender: "support" },
        { text: "How can I assist you today?", sender: "support" },
        { text: "Hi, I need help with my account.", sender: "user" },
        { text: "Sure! Can you provide more details?", sender: "support" },
      ])
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim()) {
        setMessages([...messages, { text: input, sender: "user" }]);
        setInput("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md h-full">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} className="h-8" alt="Supportium Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap">
              Supportium
            </span>
          </Link>
        </div>
        <ul className="space-y-2 p-4">
          <li className="text-gray-600 font-medium hover:bg-gray-200 rounded-lg p-2 cursor-pointer">
            <Link to="/">Dashboard</Link>
          </li>
          <li className="text-gray-600 font-medium hover:bg-gray-200 rounded-lg p-2 cursor-pointer">
            <Link to="/inbox">Inbox</Link>
          </li>
          <li className="text-gray-600 font-medium hover:bg-gray-200 rounded-lg p-2 cursor-pointer">
            <Link to="/settings">Settings</Link>
          </li>
          <li className="text-gray-600 font-medium hover:bg-gray-200 rounded-lg p-2 cursor-pointer">
            <button onClick={() => {
                if (localStorage.getItem('authToken')){
                    let conf = window.confirm(`Are you sure?`)
                    if (conf){
                        fetch("http://127.0.0.1:8000/logout/", {
                            method: 'POST',
                            headers: {
                                'Authorization' : localStorage.getItem('authToken')
                            }
                        })
                        localStorage.removeItem('authToken');
                        window.location.reload()
                        
                    }
                } 
            }}>Logout</button>
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <nav className="bg-white border-gray-200 h-16">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link to="/" className="flex items-center space-x-3 h-">

            </Link>
            <button
              data-collapse-toggle="navbar-default"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-default"
              aria-expanded="false"
            >
            </button>
            <div className="hidden w-full md:block md:w-auto" id="navbar-default">
              <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
                <li>
                  <Link
                    to="/"
                    className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/chat"
                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                  >
                    Chat
                  </Link>
                </li>
                <li>
                  {localStorage.getItem("authToken") && (
                    <Link
                      to="/profile"
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                    >
                      Profil
                    </Link>
                  )}
                  {!localStorage.getItem("authToken") && (
                    <Link
                      to="/register"
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                    >
                      Регистрация
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>
                  
      </div>
    </div>
  );
}

export default Sidebar;
