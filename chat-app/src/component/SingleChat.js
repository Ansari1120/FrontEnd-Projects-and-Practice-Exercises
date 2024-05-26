import React, { useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider";
import {
  Text,
  Box,
  IconButton,
  Spinner,
  FormControl,
  Input,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import MyModal from "./MyModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import { getFullSender, getSender, getSenderID } from "../config/constants";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import animtionData from "../animation/typing.gif";
import Lottie from "react-lottie";
import UploadFiles from "./uploadFiles";

const ENDPOINT = process.env.REACT_APP_BACKEND_URL;
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [time, setTime] = useState(3);
  const [userstatus, setUserStatus] = useState({});
  const [assetUrl, setAssetUrl] = useState();

  const {
    userData,
    setSelectedChat,
    selectedChat,
    notifications,
    setNotifications,
    setTriggerRenderer,
  } = ChatState();
  const toast = useToast();
  console.log(selectedChat);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animtionData: animtionData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      };
      setNewMessage("");
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/message/${selectedChat._id}`,
        config
      );
      setMessages([...data.data]);
      setLoading(false);
      // chat id at client , room id at server we call if someone joins the space
      // to talk between them
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured",
        description: error?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  console.log(messages);

  const sendMessage = async (event, noEvent = false, message) => {
    if ((event.key === "Enter" && newMessage) || (noEvent && message)) {
      socket.emit("stop typing", selectedChat._id);
      console.log("yoo?");
      try {
        // const config = {
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authroization: `Bearer ${userData.token}`,
        //   },
        // };
        const config = {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/message`,
          {
            content: newMessage || message,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        socket.emit("new message", data.data);
        setMessages([...messages, data.data]);
      } catch (error) {
        //  setLoading(false);
        console.log(error);
        toast({
          title: "Error Occured",
          description: error?.response?.data?.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // return;
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  function formatTimestamp(timestamp) {
    const seen = "last seen";
    const date = new Date(timestamp);
    const now = new Date();

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const sameDay =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
    const yesterday =
      date.getDate() === now.getDate() - 1 &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
    const sameWeek = now - date < 7 * 24 * 60 * 60 * 1000;
    const sameYear = date.getFullYear() === now.getFullYear();

    if (sameDay) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      // const ampm = hours >= 12 ? "PM" : "AM";
      // const formattedHours = hours % 12 || 12;
      let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      formattedMinutes = formattedMinutes - 3;

      let diffMinutes = Math.floor((now - date) / (1000 * 60));
      if (diffMinutes >= 60) {
        const diffHours = Math.floor(diffMinutes / 60);
        const formattedHours = diffHours % 12 || 12;
        const ampm = diffHours >= 12 ? "PM" : "AM";

        return `${seen} ${formattedHours} hour${
          formattedHours > 1 ? "s" : ""
        } ${ampm} ago`;
      } else {
        // diffMinutes = diffMinutes - 3;
        return `${seen} ${diffMinutes + 3} minute${
          diffMinutes > 1 ? "s" : ""
        } ago`;
      }
      // return `${seen} ${formattedHours}:${formattedMinutes} ${ampm}`;
    } else if (yesterday) {
      return `${seen} yesterday`;
    } else if (sameWeek) {
      return dayNames[date.getDay()];
    } else if (sameYear) {
      return `${seen} ${dayNames[date.getDay()]} ${date.getDate()} ${
        monthNames[date.getMonth()]
      }`;
    } else {
      return `${seen} ${dayNames[date.getDay()]} ${date.getDate()} ${
        monthNames[date.getMonth()]
      } ${date.getFullYear()}`;
    }
  }

  const handleUsers = (users) => {
    if (!users) {
      console.log("recieved users data from socket is undefined.");
    }
    console.log("Users status:", users);
    if (userData && selectedChat) {
      const user = users.find(
        (user) => user.userID === getSenderID(userData._id, selectedChat.users)
      );
      console.log("Opposite user status", user);
      setUserStatus(user);
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);

    // socket.on("connection");
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // console.log("online", onlineUsers);
  }, []);

  // useEffect(() => {
  //   // Emit the userData to the server
  //   socket.emit("status", userData);

  //   // Listen for the "users" event from the server
  //   socket.on("users", (users) => {
  //     console.log("Users status:", users);

  //     // if (users) {
  //     //   // Find the user based on your criteria
  //     //   const user = users.find(
  //     //     (user) =>
  //     //       user.userID === getSenderID(userData._id, selectedChat.users)
  //     //   );

  //     //   console.log("Opposite user status", user);
  //     //   setUserStatus(user); // Assuming setUserStatus is a function that updates the user status in the UI
  //     // }
  //   });
  // }, [selectedChat]);

  useEffect(() => {
    // Define the function to be triggered
    const triggerFunction = () => {
      console.log("3 minutes have passed");

      // // Add any other logic you want to execute after 3 minutes
      // socket.on("manualStatusUpdate", (users) => {
      //   setUserStatus({
      //     status: "offline",
      //     lastSeen: new Date().toLocaleString(),
      //     userID: updatedUserData._id,
      //   });
      // });
      socket.emit("manualStatusUpdate", userData);
      socket.on("users", handleUsers);
    };

    // Set the timeout for 3 minutes (3 * 60 * 1000 milliseconds)
    const timer = setTimeout(triggerFunction, 2 * 60 * 1000);

    // Clear the timeout if the component unmounts
    return () => {
      clearTimeout(timer);
      socket.off("users", handleUsers);
    };
  }, []);

  useEffect(() => {
    // if (!socket) {
    //   setSocket(io(ENDPOINT));
    //   console.log("Socket initialized:", socket);
    // }
    socket.emit("status", userData);

    socket.on("users", handleUsers);

    // Cleanup function to remove listeners on unmount
    return () => {
      socket.off("users", handleUsers);
    };
  }, [selectedChat, messages]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  // useEffect(() => {
  //   console.log("i work on every hit.");

  // }, [selectedChat, userData, messages]);
  console.log("notifications", notifications);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //show notificaiton. if there is not chat open or rest of a chat got the message instead
        //of openend chat.

        if (!notifications.includes(newMessageRecieved)) {
          setNotifications([...notifications, newMessageRecieved]);
          setFetchAgain(!fetchAgain);
        }
        setTriggerRenderer((prev) => !prev);
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            // paddingBottom={3}
            // paddingX={2}
            width={"100%"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {selectedChat && !selectedChat.isGroupChat
              ? getSender(userData._id, selectedChat.users).toUpperCase()
              : selectedChat?.chatName.toUpperCase()}
            {!selectedChat.isGroupChat ? (
              <MyModal user={getFullSender(userData._id, selectedChat.users)} />
            ) : (
              <UpdateGroupChatModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
              />
            )}
          </Text>
          {userstatus && (
            <Text
              fontWeight={"bold"}
              color="green"
              fontSize={{ base: "18px", md: "15px" }}
              // paddingBottom={3}
              // paddingX={2}
              width={"100%"}
              fontFamily={"Work sans"}
              display={"flex"}
              justifyContent={{ base: "space-between" }}
              alignItems={"center"}
            >
              {userstatus?.status === "online"
                ? "online"
                : formatTimestamp(userstatus?.lastSeen)}
            </Text>
          )}
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
            padding={3}
            bg="#E8E8E8"
            width={"100%"}
            height={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size="xl"
                width={20}
                height={20}
                alignSelf={"center"}
                marginTop={40}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}
            <Box display={"flex"} flexDirection={"row"} gap={5}>
              <FormControl onKeyDown={sendMessage} isRequired>
                {istyping ? (
                  // <Lottie
                  //   options={defaultOptions}
                  //   width={70}
                  //   // height={10}
                  //   style={{ marginBottom: 15, marginLeft: 0 }}
                  // />
                  <img
                    src={animtionData}
                    alt="typing"
                    width="70"
                    style={{ marginLeft: 5, marginBottom: 10 }}
                  />
                ) : // <div>typing</div>
                null}
                <Input
                  width={"100%"}
                  id="message"
                  class="chakra-input css-1cjy4zv"
                  // margin={50}
                  variant={"filled"}
                  bg="#E0E0E0"
                  placeholder="Enter a message"
                  onChange={typingHandler}
                  value={newMessage}
                />
              </FormControl>
              <UploadFiles onHit={(data) => sendMessage("", true, data)} />
            </Box>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Text fontSize={"3xl"} paddingBottom={3} fontFamily={"Work sans"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
