import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import React, { Fragment } from "react";

const UsersList = ({ key, user, handleAccessUser }) => {
  return (
    <Fragment key={key}>
      <Flex
        onClick={handleAccessUser}
        cursor="pointer"
        bg="#E8E8E8"
        _hover={{
          backgroundColor: "#38B2AC",
          color: "white",
        }}
        w="100%"
        d="flex"
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
      >
        <Avatar
          src={user.profilePicture}
          mr={2}
          size="sm"
          cursor="pointer"
          name={user.name}
        />
        <Box>
          <Text>{user.name}</Text>
          <Text fontSize={"12px"}>
            <span>
              <b>Email : </b>
              {user.email}
            </span>
          </Text>
        </Box>
      </Flex>
    </Fragment>
  );
};

export default UsersList;
