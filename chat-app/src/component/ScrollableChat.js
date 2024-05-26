import React, { useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../context/chatProvider";
import { isLastMessage, isSameSender, isSameUser } from "../config/constants";
import { Avatar, Image, Tooltip } from "@chakra-ui/react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

const ScrollableChat = ({ messages }) => {
  const { userData } = ChatState();
  const [pageNumber, setPageNumber] = useState(1);

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
            <span
              style={{
                backgroundColor: `${
                  message.sender._id === userData._id ? "#BEE3F8" : "#B9F5D0"
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
                    : !isSameSender(messages, message, index, userData._id) &&
                      !isLastMessage(messages, index, userData._id) &&
                      message.sender._id !== userData._id
                    ? 38
                    : 0, // No margin for recipient's messages
                marginRight:
                  message.sender._id === userData._id
                    ? 0 // No margin for sender's messages
                    : "auto", // Align to the left for recipient's messages
                marginTop: isSameUser(messages, message, index, userData._id)
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
              ) : message.content.includes(".mp4") ? (
                <video controls>
                  <source src={message.content} type={"video/mp4"} />
                  Your browser does not support the video tag.
                </video>
              ) : message.content.includes(".mp3") ? (
                <audio controls>
                  <source src={message.content} type={"video/mp4"} />
                  Your browser does not support the video tag.
                </audio>
              ) : message.content.includes(".pdf") ? (
                <Document
                  file={message.content}
                  onLoadSuccess={({ numPages }) => setPageNumber(numPages)}
                  onLoadError={console.error}
                >
                  <Page pageNumber={pageNumber} />
                </Document>
              ) : (
                message.content
              )}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
