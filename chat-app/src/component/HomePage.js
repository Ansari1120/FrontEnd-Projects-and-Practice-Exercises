import {
  Button,
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const history = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userInfo"));

    if (data) {
      history("/chats");
    }
  }, [history]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
          fontSize="4xl"
          fontFamily="Work sans"
          color="black"
          textAlign="center"
        >
          Truss-Chat-App
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <Text
        backgroundColor={"rgba(0,0,0,0.5)"}
        borderRadius={"100px"}
        margin={"5px"}
        padding={"5px"}
        maxWidth={"90%"}
        // paddingLeft={"5px"}
        // paddingRight={"5px"}
        fontWeight={"bold"}
        fontSize="medium"
        fontFamily="monospace"
        color="white"
        textAlign="center"
      >
        Designed and Developed Designed by Ahmed Ali Ansari
      </Text>
    </Container>
  );
};

export default HomePage;
