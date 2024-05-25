import { VStack } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  Input,
  InputRightElement,
  Button,
  InputGroup,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../context/chatProvider";

const Login = () => {
  const history = useNavigate();
  const [loginUserData, setLoginUserData] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmshowPassword, setConfirmShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const {
    userData,
    setUserData,
    setSelectedChat,
    selectedChat,
    chats,
    setChats,
  } = ChatState();
  const handleUserData = (key, value) => {
    setLoginUserData({ ...loginUserData, [key]: value });
  };

  const postImage = (pics) => {};
  const HandlePostUser = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/login`,
        loginUserData,
        config
      );
      console.log(data);
      toast({
        title: "Message",
        description: data.message,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      localStorage.setItem("userInfo", JSON.stringify(data.data));
      setUserData(data.data);

      setLoading(false);
      history("/chats", { hit: true });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Validation Error",
        description: error?.response?.data?.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  // console.log("data", loginUserData);
  // console.log(showPassword);
  return (
    <VStack spacing={"5px"} color="black">
      <FormControl id="email" isRequired>
        <FormLabel>E-mail</FormLabel>
        <Input
          id="my-email"
          class="chakra-input css-1cjy4zv"
          value={loginUserData.email}
          placeholder="enter your email"
          onChange={(e) => handleUserData("email", e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            id="my-password"
            class="chakra-input css-1cjy5zv"
            value={loginUserData.password}
            type={showPassword ? "text" : "password"}
            placeholder="enter your password"
            onChange={(e) => handleUserData("password", e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ maginTop: 15 }}
        onClick={HandlePostUser}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        colorScheme="red"
        width="100%"
        style={{ maginTop: 15 }}
        onClick={() => {
          setLoginUserData({
            ...loginUserData,
            email: "guest@example.com",
            password: "123456",
          });
        }}
      >
        Login as Guest User
      </Button>
    </VStack>
  );
};

export default Login;
