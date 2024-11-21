import React from "react";
import ChatBlock from "../chat/chat";


const MainContent = () => {
  return (
        <div className="p-4 sm:ml-64">
            <div className="p-4 size-full  rounded-lg mt-14">
                <ChatBlock />
            </div>
        </div>
  );
};

export default MainContent;
