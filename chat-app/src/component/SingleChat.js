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

const ENDPOINT = process.env.REACT_APP_BACKEND_URL;
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [userstatus, setUserStatus] = useState("");
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

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
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
            content: newMessage,
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

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);

    // socket.on("connection");
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // console.log("online", onlineUsers);
  }, []);

  useEffect(() => {
    // Emit the userData to the server
    socket.emit("status", userData);

    // Listen for the "users" event from the server
    socket.on("users", (users) => {
      console.log("Users status:", users);

      // if (users) {
      //   // Find the user based on your criteria
      //   const user = users.find(
      //     (user) =>
      //       user.userID === getSenderID(userData._id, selectedChat.users)
      //   );

      //   console.log("Opposite user status", user);
      //   setUserStatus(user); // Assuming setUserStatus is a function that updates the user status in the UI
      // }
    });
  }, [selectedChat]);
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
            paddingBottom={3}
            paddingX={2}
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
            {userstatus.status === "online" ? "online" : userstatus.lastSeen}
          </Text>
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
