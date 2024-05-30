import React, { Fragment, useCallback, useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider";
import { Box, Button, Image, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import {
  getFullSender,
  getSender,
  getTimeAccordingToCondition,
} from "../config/constants";
import GroupChatModal from "./GroupChatModal";
import { useNavigate } from "react-router-dom";
import pdf from "../assets/pdf.png";
import video from "../assets/video.png";
import music from "../assets/music.png";
import image from "../assets/image.png";
import group from "../assets/group.png";
var selectedChatCompare;

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  const {
    userData,
    setSelectedChat,
    selectedChat,
    chats,
    setChats,
    triggerRenderer,
    setTriggerRenderer,
  } = ChatState();
  const toast = useToast();
  const handleFetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      };
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat`,
        config
      );

      // if (!chats.find((c) => c._id === data.data._id)) {
      //   return setChats([data.data, ...chats]);
      // }

      console.log("chats", data);
      setChats(data.data);
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
      if (error.response.status === 401) {
        localStorage.removeItem("userInfo");
        history("/");
      }
    }
  };

  // useEffect(() => {
  //   setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  //   handleFetchChats();
  // }, [selectedChat, userData]);

  useEffect(() => {
    console.log("yooo");
    // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // if (userInfo) {
    //   setLoggedUser(userInfo);
    handleFetchChats();
    // }
  }, [triggerRenderer, userData]);

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
        <Text
          fontSize={{ base: "28px", md: "19px" }}
          fontFamily={"Work sans"}
          fontWeight={"semibold"}
        >
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
                  backgroundColor={
                    selectedChat === chat ? "#38B2AC" : "#E8E8E8"
                  }
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius={"lg"}
                  key={index}
                >
                  <Box
                    display={"flex"}
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    // gap={4}
                  >
                    {/* <Box flex={1}> */}
                    {chat && (
                      <Image
                        src={
                          !chat.isGroupChat
                            ? getFullSender(userData._id, chat.users)
                                .profilePicture
                            : group
                        }
                        alt="pdf"
                        width={7}
                        // marginRight={-75}
                        height={7}
                        objectFit={"contain"}
                        borderRadius={30}
                      />
                    )}
                    <Box
                      flex={1}
                      marginLeft={3}
                      // marginRight={chat && chat.latestMessage ? 75 : 123}
                      // alignItems={"center"}
                      // alignSelf={"flex-start"}
                    >
                      <Text noOfLines={1}>
                        {chat && !chat.isGroupChat
                          ? getSender(userData._id, chat.users)
                          : chat.chatName}
                        {/* { chat.chatName} */}
                      </Text>
                      {chat && chat?.latestMessage !== null && (
                        <Text
                          fontWeight={"extra-bold"}
                          fontFamily={"Work sans"}
                          fontSize={"12px"}
                          textAlign={"flex-start"}
                        >
                          <b>
                            <Box display={"flex"} flexDirection={"row"}>
                              <Box>
                                <spn>
                                  {userData._id === chat?.latestMessage?.sender
                                    ? "you : "
                                    : null}
                                </spn>
                              </Box>
                              <Box>
                                {chat?.latestMessage?.content.includes(
                                  "http"
                                ) ? (
                                  <Image
                                    src={
                                      chat?.latestMessage?.content.includes(
                                        "pdf"
                                      )
                                        ? pdf
                                        : chat?.latestMessage?.content.includes(
                                            "mp3"
                                          )
                                        ? music
                                        : chat?.latestMessage?.content.includes(
                                            "mp4"
                                          )
                                        ? video
                                        : image
                                    }
                                    alt="pdf"
                                    width={5}
                                    marginX={1}
                                    height={5}
                                    objectFit={"contain"}
                                  />
                                ) : (
                                  chat?.latestMessage?.content
                                )}
                              </Box>
                            </Box>
                          </b>
                        </Text>
                      )}
                    </Box>
                    <Text
                      // paddingLeft={19}
                      // justifyContent={"flex-end"}
                      fontWeight={"extra-bold"}
                      fontFamily={"Work sans"}
                      fontSize={"14px"}
                    >
                      {getTimeAccordingToCondition(
                        chat?.latestMessage?.updatedAt
                      )}
                    </Text>
                    {/* </Box> */}
                  </Box>
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
