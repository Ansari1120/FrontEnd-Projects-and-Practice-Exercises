import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../context/chatProvider";
import axios from "axios";
import UsersList from "./UsersList";
import UsersBadge from "./UsersBadge";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userData, chats, setChats } = ChatState();
  const [chatCreateData, setChatCreateData] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleData = (key, value) => {
    setChatCreateData({ ...chatCreateData, [key]: value });
  };

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      };
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/user?search=${query}`,
        config
      );

      setLoading(false);
      console.log(data);
      setSearch([...data.data]);
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
  const handleSubmit = async () => {
    if (!chatCreateData || !selectedUsers) {
      return toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/group`,
        {
          name: chatCreateData.name,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      console.log("group chat res", data);
      setChats([data.data, ...chats]);
      onClose();
      toast({
        title: "Success",
        description: data?.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    } catch (error) {
      console.log("group chat res", error);

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
  const handleGroup = (recipeintToAdd) => {
    if (selectedUsers.includes(recipeintToAdd)) {
      return toast({
        title: "User Already Added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setSelectedUsers([...selectedUsers, recipeintToAdd]);
  };
  const handleDelete = (del_recipient) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== del_recipient._id)
    );
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width={{ base: "70%" }}>
          <ModalHeader
            marginTop={{ base: 5 }}
            fontSize={{ base: "24px", md: "35px" }}
            fontFamily={"Work sans"}
            display="flex"
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => handleData("name", e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users e.g: John,Piyush,Jane"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UsersBadge
                  key={u._id}
                  user={u}
                  handleUser={() => handleDelete(u)}
                />
              ))}
            </Box>

            {loading ? (
              <div>loading</div>
            ) : (
              search
                .slice(0, 4)
                .map((user) => (
                  <UsersList
                    key={user._id}
                    user={user}
                    handleAccessUser={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              // boxSize={{ base: 50 }}
              colorScheme="blue"
              onClick={handleSubmit}
            >
              Create Chat
            </Button>
            {/* <Button variant="ghost">Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
