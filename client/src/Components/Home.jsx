import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Heading,
  Link,
  Text,
  HStack,
  WrapItem,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToast } from "../Utils/extraFunctions";

function Home() {
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const handleBlog = async () => {
    if (title === "" || input === "") {
      console.log("hi");
      return setToast(
        toast,
        "Please Add Title And Descripton For Blog",
        "error"
      );
    }
    let jwt = localStorage.getItem("jwttoken");
    try {
      let res = await axios.post("http://localhost:8080/blog", {
        data: { title: title, description: input },
        jwt: jwt,
      });
      console.log(res);
      navigate("/blogs");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Box
        width={"100%"}
        minHeight={"92.5vh"}
        bg={"gray.800"}
        display={"flex"}
        flexDirection={"row"}
        justifyContent="space-evenly"
        alignItems={"center"}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent={"center"}
          alignItems="center"
          margin="auto"
        >
          <Box>
            {" "}
            <FormControl id="Title" isRequired>
              <FormLabel mt="2%" mb="2%" color={"white"}>
                Title
              </FormLabel>
              <Input
                backgroundColor="#ebecf0"
                width="500px"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Title For Yor Blog"
              ></Input>
            </FormControl>
          </Box>
          <Box>
            {" "}
            <FormControl id="Description" isRequired>
              <FormLabel mt="2%" mb="2%" color={"white"}>
                Description
              </FormLabel>
              <Textarea
                height="200px"
                width="500px"
                placeholder="Type Info About Your Blog."
                backgroundColor="#ebecf0"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </FormControl>
          </Box>
          <Button
            onClick={handleBlog}
            size="lg"
            bg={"blue.400"}
            color={"white"}
            bgGradient="linear(to-r, red.400,pink.400)"
            _hover={{
              bgGradient: "linear(to-r, red.400,pink.400)",
              boxShadow: "xl",
            }}
            mt={5}
          >
            Upload
          </Button>
        </Box>
        <WrapItem
          width={{ base: "50%", sm: "45%", md: "45%", lg: "30%" }}
          boxShadow={
            "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px"
          }
          p={5}
          borderRadius={4}
          key={title}
          bg="white"
          margin={"auto"}
        >
          <Box textAlign={"justify"} w="100%">
            <Heading fontSize="xl" marginTop="2">
              <Link textDecoration="none" _hover={{ textDecoration: "none" }}>
                {title}
              </Link>
            </Heading>
            <Text as="p" fontSize="md" marginTop="2">
              {input}
            </Text>
            <HStack
              marginTop="2"
              spacing="2"
              display="flex"
              alignItems="center"
            >
              <Text fontWeight="medium">Raman Rushi</Text>
              <Text fontWeight={"semibold"}>—</Text>
              <Text>22-10-2022</Text>
            </HStack>
          </Box>
        </WrapItem>
      </Box>
    </>
  );
}

export default Home;
