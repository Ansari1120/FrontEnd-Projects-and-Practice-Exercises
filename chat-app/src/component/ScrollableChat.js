import React, { useEffect, useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../context/chatProvider";
import { isLastMessage, isSameSender, isSameUser } from "../config/constants";
import { Avatar, Box, Button, Image, Text, Tooltip } from "@chakra-ui/react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { DownloadIcon } from "@chakra-ui/icons";
import axios from "axios";

const ScrollableChat = ({ messages }) => {
  const { userData } = ChatState();
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState("");

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const handlePdfDownload = async (url) => {
    try {
      // const credentials =
      //   process.env.REACT_APP_CLOUDINARY_API_KEY +
      //   ":" +
      //   process.env.REACT_APP_CLOUDINARY_API_SECRET;
      // const encodedCredentials = btoa(credentials);

      const response = await axios.get(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error opening PDF:", error);
    }
  };

  // useEffect(() => {

  //   fetchPdfUrl();
  // }, []);
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, index) => (
          <div
            style={{ display: "flex", marginBottom: "10px" }}
            key={message._id}
          >
            {(isSameSender(messages, message, index, userData._id) ||
              isLastMessage(messages, index, userData._id)) && (
              <Tooltip
                label={message.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor={"pointer"}
                  name={message.sender.name}
                  src={message.sender.profilePicture}
                />
              </Tooltip>
            )}

            {!message.content.includes(".mp4") &&
              !message.content.includes(".mp3") && (
                <span
                  style={{
                    backgroundColor: `${
                      message.sender._id === userData._id
                        ? "#BEE3F8"
                        : "#B9F5D0"
                    }`,

                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                    // marginLeft:
                    //   message.sender._id === userData._id
                    //     ? 540
                    //     : !isSameSender(messages, message, index, userData._id) &&
                    //       !isLastMessage(messages, index, userData._id) &&
                    //       message.sender._id !== userData._id
                    //     ? 38
                    //     : 0,
                    marginLeft:
                      message.sender._id === userData._id
                        ? "auto" // Align to the right for sender's messages
                        : !isSameSender(
                            messages,
                            message,
                            index,
                            userData._id
                          ) &&
                          !isLastMessage(messages, index, userData._id) &&
                          message.sender._id !== userData._id
                        ? 38
                        : 0, // No margin for recipient's messages
                    marginRight:
                      message.sender._id === userData._id
                        ? 0 // No margin for sender's messages
                        : "auto", // Align to the left for recipient's messages
                    marginTop: isSameUser(
                      messages,
                      message,
                      index,
                      userData._id
                    )
                      ? 3
                      : 10,
                  }}
                >
                  {message.content.includes(".jpg") ||
                  message.content.includes(".jpeg") ||
                  message.content.includes(".png") ? (
                    <Image
                      objectFit={"contain"}
                      title="asset"
                      src={message.content}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  ) : message.content.includes(".pdf") ? (
                    <Text>
                      PDF File
                      <Button
                        onClick={() => handlePdfDownload(message.content)}
                        marginLeft={2}
                        w={5}
                        h={5}
                        variant={"ghost"}
                      >
                        <DownloadIcon />
                      </Button>
                    </Text>
                  ) : (
                    message.content
                  )}
                </span>
              )}

            {message.content &&
              (message.content.includes(".mp4") ||
                message.content.includes(".mp3")) && (
                <span
                  style={{
                    backgroundColor: `${
                      message.sender._id === userData._id
                        ? "#BEE3F8"
                        : "#B9F5D0"
                    }`,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "100%",
                    marginLeft:
                      message.sender._id === userData._id
                        ? "auto" // Align to the right for sender's messages
                        : !isSameSender(
                            messages,
                            message,
                            index,
                            userData._id
                          ) &&
                          !isLastMessage(messages, index, userData._id) &&
                          message.sender._id !== userData._id
                        ? 38
                        : 0, // No margin for recipient's messages
                    marginRight:
                      message.sender._id === userData._id
                        ? 0 // No margin for sender's messages
                        : "auto", // Align to the left for recipient's messages
                    marginTop: isSameUser(
                      messages,
                      message,
                      index,
                      userData._id
                    )
                      ? 3
                      : 10,
                  }}
                >
                  {message.content.includes(".mp4") ? (
                    <Box width={{ md: "100%", base: "100%" }} height={"100%"}>
                      <video style={{ width: "100%", height: "100%" }} controls>
                        <source src={message.content} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </Box>
                  ) : (
                    <audio style={{ width: "180px", height: "40px" }} controls>
                      <source
                        width={"auto"}
                        src={message.content}
                        type="audio/mp3"
                      />
                      Your browser does not support the audio tag.
                    </audio>
                  )}
                </span>
              )}
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
