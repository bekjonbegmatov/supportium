import React from "react";
import { Link } from "react-router-dom";
import { FaComments, FaChevronCircleLeft, FaLifeRing, FaUserPlus, FaSignInAlt,FaRegUserCircle } from "react-icons/fa";


const Sidebar = () => {
  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
        <ul className="space-y-2 font-medium">
          <li>
            <Link
              to="/chat"
              className="flex items-center p-2 text-gray-900 rounded-lg text-xxl font-bold hover:bg-gray-200 group"
            >
              <FaComments className="mr-3 text-lg" />
              Чат AI
            </Link>
          </li>
          <li>
            <Link
              to="/support"
              className="flex items-center p-2 text-gray-900 rounded-lg text-xxl font-bold hover:bg-gray-200 group"
            >
              <FaLifeRing className="mr-3 text-lg" />
              Support
            </Link>
          </li>
          {localStorage.getItem('authToken') ? (
            <div>
                <li>
                    <Link 
                    to="profile" 
                    className="flex items-center p-2 text-gray-900 rounded-lg text-xxl font-bold hover:bg-gray-200 group"
                    >
                        <FaRegUserCircle  className="mr-3 text-lg" />
                        Профиль
                    </Link>
                </li>
                <li>
                    <button
                    
                    className="flex items-center p-2 text-gray-900 rounded-lg text-xxl font-bold hover:bg-gray-200 group"
                    >
                    <FaChevronCircleLeft className="mr-3 text-lg" /> 
                    Выйти
                    </button>
                </li>
            </div>
          ):(
            <div>
                <li>
                    <Link
                    to="/register"
                    className="flex items-center p-2 text-gray-900 rounded-lg text-xxl font-bold hover:bg-gray-200 group"
                    >
                    <FaUserPlus className="mr-3 text-lg" />
                    Register
                    </Link>
                </li>
                <li>
                    <Link
                    to="/login"
                    className="flex items-center p-2 text-gray-900 rounded-lg text-xxl font-bold hover:bg-gray-200 group"
                    >
                    <FaSignInAlt className="mr-3 text-lg" />
                    Login
                    </Link>
                </li>
            </div>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
