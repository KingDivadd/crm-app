import React from "react";
import {useState, createContext, useContext, useEffect}  from "react"
import axios from "axios";

const ChatInfoContext  = createContext()

export const ChatInfoProvider = ({children})=>{
    const [loggedInUser, setLoggedInUser] = useState({id: ''})
    const [chatInfo, setChatInfo] = useState({chatName: 'DEFAULT NAME', chatPicture: 'default pic', chatMessages: '', chatLastMessage: '', users: [], chatId: ''})

    const [selfMessageHolder, setSelfMessageHolder] = useState([])
    return <ChatInfoContext.Provider value={{chatInfo,setLoggedInUser, setChatInfo, selfMessageHolder, setSelfMessageHolder, loggedInUser}}>{children} </ChatInfoContext.Provider>
}
export const ChatState = () => {
    return useContext(ChatInfoContext);
};



export default ChatInfoProvider