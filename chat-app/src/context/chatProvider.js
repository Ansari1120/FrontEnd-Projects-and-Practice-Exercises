import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const Context = createContext();
const socket = io(process.env.REACT_APP_BACKEND_URL);

const ChatProvider = ({ children }) => {
  const history = useNavigate();
  const [userData, setUserData] = useState(() => {
    const data = JSON.parse(localStorage.getItem("userInfo"));
    return data || null; // Initialize userData with data from localStorage or null if not available
  });
  const [selectedChat, setSelectedChat] = useState();
  const [triggerRenderer, setTriggerRenderer] = useState(false);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Update userData state whenever it changes in localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userInfo"));
    if (data) {
      setUserData(data);
    } else {
      history("/"); // Redirect to login page if userData is not available
    }
  }, []);

  return (
    <Context.Provider
      value={{
        userData,
        setUserData,
        selectedChat,
        setSelectedChat,
        chats,
        triggerRenderer,
        setTriggerRenderer,
        setChats,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const ChatState = () => {
  return useContext(Context);
};
export default ChatProvider;
