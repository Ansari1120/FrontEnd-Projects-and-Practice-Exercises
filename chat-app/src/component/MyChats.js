import React, { Fragment, useCallback, useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/constants";
import GroupChatModal from "./GroupChatModal";
import { useNavigate } from "react-router-dom";

const MyChats = ({ fetchAgain, fetchChats, loggedUser }) => {
  // const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState();
  const history = useNavigate();
  const { userData, setSelectedChat, selectedChat, chats, setChats } =
    ChatState();
  const toast = useToast();
  // const handleFetchChats = async () => {
  //   try {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${userData.token}`,
  //       },
  //     };
  //     const { data } = await axios.get(
  //       `${process.env.REACT_APP_BACKEND_URL}/api/chat`,
  //       config
  //     );

  //     if (!chats.find((c) => c._id === data.data._id)) {
  //       return setChats([data.data, ...chats]);
  //     }

  //     // setLoadingChat(false);
  //     console.log("chats", data);
  //     setChats(data.data);
  //   } catch (error) {
  //     // setLoading(false);
  //     console.log(error);
  //     toast({
  //       title: "Error Occured",
  //       description: error?.response?.data?.message,
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //       position: "bottom-left",
  //     });
  //     if (error.response.status === 401) {
  //       localStorage.removeItem("userInfo");
  //       history("/");
  //     }
  //   }
  // };

  // useEffect(() => {
  //   setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  //   handleFetchChats();
  // }, [selectedChat, userData]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection={"column"}
      alignItems={"center"}
      padding={3}
      margin={"10px"}
      bg="white"
      width={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth={"1px"}
      height={"85vh"}
    >
      <Box
        pb={3}
        px={3}
        display={"flex"}
        w="100%"
        gap={4}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Text fontSize={{ base: "28px", md: "19px" }} fontFamily={"Work sans"}>
          My Chats
        </Text>
        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "12px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display={"flex"}
        flexDirection={"row"}
        p={3}
        // bg="#F8F8F8"
        w="100%"
        borderRadius={"lg"}
        overflowY={"hidden"}
        height={"100%"}
      >
        {chats ? (
          <Stack overflowY={"scroll"} width={"100%"}>
            {chats.map((chat, index) => (
              <Fragment key={index}>
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor={"pointer"}
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius={"lg"}
                  key={chat._id}
                >
                  <Text>
                    {chat && !chat.isGroupChat
                      ? getSender(userData._id, chat.users)
                      : chat.chatName}
                    {/* { chat.chatName} */}
                  </Text>
                </Box>
              </Fragment>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
