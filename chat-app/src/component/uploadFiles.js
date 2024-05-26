import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Box,
  Input,
  AspectRatio,
  Image,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { DeleteIcon, PhoneIcon } from "@chakra-ui/icons";
import { Document, Page, pdfjs } from "react-pdf";
import { ChatState } from "../context/chatProvider";
import axios from "axios";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
const UploadFiles = ({ onHit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [asset, setAsset] = useState(
    "https://www.posterprintfactory.com/assets/file_placeholder.png"
  );
  const [assetType, setAssetType] = useState("");
  const [rawAsset, setRawAsset] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const {
    userData,
    setSelectedChat,
    selectedChat,
    notifications,
    setNotifications,
    setTriggerRenderer,
  } = ChatState();
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
  ).toString();
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setRawAsset(file);
    setAssetType(file?.type);
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
    }
    reader.onloadend = () => {
      setAsset(reader.result);
      console.log("file:", reader.result);
    };
  };

  const handlePostAsset = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      //  setNewMessage("");
      const form = new FormData();
      form.append("asset", rawAsset);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/asset/uploadAsset`,
        form,
        config
      );
      setLoading(false);
      onHit(data.data);
      console.log(data);
      onClose();
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
  return (
    <Box>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          position="fixed"
          bottom="78"
          right="9"
          margin="0"
          borderRadius="10"
          // width="auto"
          // width={"70%"}
        >
          <ModalHeader>Upload Asset</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* <Lorem count={2} /> */}
            Choose any file you want to send.
            <Input
              // accept="application/pdf"
              placeholder="Choose a file"
              size="md"
              type="file"
              // marginX={5}
              padding={1}
              onChange={handleFileUpload}
            />
            <AspectRatio resize={"contain"} maxW="400px" ratio={4 / 3}>
              {assetType?.includes("image") ? (
                <Image
                  src={asset}
                  alt="car"
                  // objectFit="contain"
                  // style={{ resize: "contain" }}
                />
              ) : assetType?.includes("video") ? (
                <video controls>
                  <source src={asset} type={assetType} />
                  Your browser does not support the video tag.
                </video>
              ) : asset?.includes("mpeg") ? (
                <audio controls>
                  <source src={asset} type={assetType} />
                  Your browser does not support the video tag.
                </audio>
              ) : (
                // <iframe
                //   title="pdf"
                //   src={asset}
                //   style={{ width: "100%", height: "100%" }}
                // />
                <Document
                  file={rawAsset}
                  onLoadSuccess={({ numPages }) => setPageNumber(numPages)}
                >
                  <Page pageNumber={pageNumber} />
                </Document>
              )}
            </AspectRatio>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => {
                setAsset(
                  "https://www.posterprintfactory.com/assets/file_placeholder.png"
                );
                setAssetType("");
              }}
              variant="ghost"
            >
              <DeleteIcon />
            </Button>
            {loading ? (
              <Spinner
                size="xl"
                width={5}
                height={5}
                mr={3}
                // alignSelf={"center"}
                // marginTop={40}
              />
            ) : (
              <Button colorScheme="blue" mr={3} onClick={handlePostAsset}>
                Send
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UploadFiles;
