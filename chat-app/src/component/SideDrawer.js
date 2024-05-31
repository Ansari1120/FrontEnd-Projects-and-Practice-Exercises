import { BellIcon, ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  filter,
  useToast,
} from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import React, { useState } from "react";
import { ChatState } from "../context/chatProvider";
import MyModal from "./MyModal";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UsersList from "./UsersList";
import { getSender } from "../config/constants";
import { io } from "socket.io-client";

const ENDPOINT = process.env.REACT_APP_BACKEND_URL;
var socket;

const SideDrawer = () => {
  const {
    userData,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
    triggerRenderer,
    setTriggerRenderer,
  } = ChatState();
  const history = useNavigate();
  // console.log("user", userData);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const handleLogout = async () => {
    socket = io(ENDPOINT);
    socket.emit("manualStatusUpdate", userData);
    socket.emit("setup-off", userData);
    localStorage.removeItem("userInfo");
    history("/");
  };

  const handleSearch = async () => {
    if (!search) {
      return toast({
        title: "Please Enter Something to search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      };
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/user?search=${search}`,
        config
      );

      setLoading(false);
      console.log(data);
      setSearchResults([...data.data]);
      // setSearchResults(data.data)
    } catch (error) {
      setLoading(false);
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

  const handleAccessUser = async (recipientId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/`,
        {
          recipientId,
        },
        config
      );
      setLoadingChat(false);
      console.log(data);
      setSelectedChat(data.data);
      setTriggerRenderer((prev) => !prev);
      onClose();
    } catch (error) {
      setLoadingChat(false);
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

  return (
    <>
      <Flex
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
        justifyContent="space-between"
        alignContent="space-between"
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="right-end">
          <Button
            marginX={{ base: -12 }}
            paddingX={{ base: 12 }}
            variant="ghost"
            onClick={onOpen}
          >
            <i className="fas fa-search"></i>
            <Text
              d={{ base: "none", md: "flex" }}
              px="4"
              fontSize={{ base: 14 }}
            >
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text
          marginTop={{ base: 1 }}
          fontWeight={"semibold"}
          fontSize={{ base: "large", md: "2xl" }}
          fontFamily="Work Sans"
          ml={{ md: "4" }}
          mr={{ base: "4" }}
        >
          Truss
        </Text>
        <Box>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize={{ base: "lg", md: "2xl" }} m={1} />
              <Badge
                position={"absolute"}
                right={{ xl: "8%", md: "11%", sm: "18%", base: "20%" }}
                colorScheme="red"
                textAlign={"center"}
                rounded={100}
              >
                {notifications.length}
              </Badge>
            </MenuButton>

            <MenuList>
              {!notifications.length && "no new messages"}
              {notifications.map((notify) => (
                <MenuItem
                  // fontSize={{ base: "12%" }}
                  key={notify._id}
                  onClick={() => {
                    console.log("clickedddd...");
                    setSelectedChat(notify.chat);
                    // setSelectedChat(data.data);
                    // onClose();
                    //filter out opened notif above one.
                    const filtered = notifications.filter((n) => n !== notify);

                    setNotifications([...filtered]);
                  }}
                >
                  {notify.chat.isGroupChat
                    ? `A new message in group chat of ${notify.chat.chatName}`
                    : `A new message in chat of ${getSender(
                        userData._id,
                        notify.chat.users
                      )}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              width={{ base: 10, md: 79 }}
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                width={{ base: 5 }}
                height={{ base: 5 }}
                size={"sm"}
                cursor="pointer"
                name={userData.name}
                src={userData.profilePicture}
              />
            </MenuButton>
            <MenuList>
              <MyModal user={userData}>
                <MenuItem>My Profile</MenuItem>
              </MyModal>
              <MenuDivider />

              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>
            Search Users
            <span>
              <CloseIcon
                onClick={onClose}
                marginLeft={{ base: 100, md: 140 }}
                boxSize={3}
              />
            </span>
          </DrawerHeader>
          <DrawerBody>
            <Flex pb={2} d="flex">
              <Input
                id="email"
                class="chakra-input css-1cjy4zv"
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Flex>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResults?.map((user, index) => (
                <UsersList
                  key={index}
                  user={user}
                  handleAccessUser={() => handleAccessUser(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
