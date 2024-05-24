import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider";
import { Box, Flex, useToast } from "@chakra-ui/react";
import SideDrawer from "./SideDrawer";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";
import { useNavigate, useLocation } from "react-router-dom";

const ChatsPage = () => {
  const { userData, setSelectedChat, selectedChat, chats, setChats } =
    ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  // const handleFetchChats = async () => {
  //   try {
  //     console.log("user", userData?.token);
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
  //     if (error?.response?.status === 401) {
  //       localStorage.removeItem("userInfo");
  //       history("/");
  //     }
  //   }
  // };

  // useEffect(() => {
  //   // setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  //   handleFetchChats();
  // }, [selectedChat, userData]);
  // useEffect(() => {
  //   // setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  //   handleFetchChats();
  // }, [loc.hit]);
  return (
    <div style={{ width: "100%" }}>
      {userData && <SideDrawer />}
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        width={"100%"}
        height={"91.5vh"}
        padding={"10px"}
        // flexDirection={"row"}
        // // alignItems={"center"}
        // // justifyContent={"center"}
      >
        {userData && <MyChats />}
        {userData && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatsPage;
