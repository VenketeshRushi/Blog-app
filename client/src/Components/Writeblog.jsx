import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Heading,
  Text,
  HStack,
  WrapItem,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAPI } from "../redux/authentication/auth.action";
import { setToast } from "../Utils/extraFunctions";

function Writeblog() {
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let user = Cookies.get("role");
    if (user !== "blogger") {
      setToast(toast, "To Create Blogs You Have To Login As Blogger", "error");
      navigate("/blogs");
    }
  }, []);

  const handleBlog = async () => {
    if (title === "" || input === "") {
      return setToast(
        toast,
        "Please Add Title And Descripton For Blog",
        "error"
      );
    }
    let jwt = Cookies.get("jwttoken");
    try {
      let res = await axios.post(
        "http://localhost:8080/blog/blog",
        {
          data: { title: title, description: input },
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      navigate("/yourblogs");
    } catch (error) {
      try {
        if (error.response.status === 400) {
          let refreshtoken = Cookies.get("refreshtoken");
          let res1 = await axios.post("http://localhost:8080/user/refresh", {
            headers: {
              Authorization: "Bearer " + refreshtoken,
            },
          });
          Cookies.set("jwttoken", res1.data.jwttoken, {
            expires: new Date(new Date().getTime() + 60 * 60 * 1000),
          });
          Cookies.set("userid", res1.data.userid, {
            expires: new Date(new Date().getTime() + 7 * 60 * 60 * 1000),
          });
          Cookies.set("role", res1.data.role, {
            expires: new Date(new Date().getTime() + 60 * 60 * 1000),
          });
          jwt = Cookies.get("jwttoken");

          let res2 = await axios.post(
            "http://localhost:8080/blog/blog",
            {
              data: { title: title, description: input },
            },
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          );
        }
        navigate("/yourblogs");
      } catch (error) {
        setToast(toast, error.response.data.message, "error");
        if (error.response.status === 404) {
          Cookies.remove("jwttoken");
          Cookies.remove("refreshtoken");
          Cookies.remove("userid");
          Cookies.remove("role");
          dispatch(logoutAPI());
          navigate("/");
        }
      }
    }
  };
  return (
    <>
      <Box
        width={"100%"}
        minHeight={"92.5vh"}
        bg={useColorModeValue("gray.50", "gray.900")}
        display={"flex"}
        flexDirection={"row"}
        flexWrap="wrap-reverse"
        justifyContent="space-evenly"
        alignItems={"center"}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent={"center"}
          alignItems="center"
          margin="auto"
          w={["sm", "md", "lg"]}
          maxW={"lg"}
          p={2}
        >
          <Box w={"100%"}>
            {" "}
            <FormControl id="Title" isRequired>
              <FormLabel mt="2%" mb="2%">
                Title
              </FormLabel>
              <Input
                backgroundColor="useColorModeValue('gray.50', 'gray.900')"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Title For Yor Blog Here"
                variant={"outline"}
              ></Input>
            </FormControl>
          </Box>
          <Box width={"100%"}>
            {" "}
            <FormControl id="Description" isRequired>
              <FormLabel mt="2%" mb="2%">
                Description
              </FormLabel>
              <Textarea
                height="200px"
                placeholder="Write Description About Your Blog Here"
                backgroundColor="useColorModeValue('gray.50', 'gray.900')"
                variant={"outline"}
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
            mt={4}
          >
            Upload
          </Button>
        </Box>
        <WrapItem
          boxShadow={
            "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px"
          }
          p={4}
          borderRadius={4}
          key={title}
          margin={"auto"}
          bgColor={useColorModeValue("gray.50", "gray.800")}
        >
          <Box textAlign={"justify"} w="100%">
            <Heading fontSize="xl" marginTop="2">
              <Text
                maxHeight={"60px"}
                overflowY={"scroll"}
                maxWidth={["200px", "400px"]}
                textDecoration="none"
                _hover={{ textDecoration: "none" }}
              >
                {title}
              </Text>
            </Heading>
            <Text
              maxHeight={"90px"}
              maxWidth={["200px", "400px"]}
              overflowY={"scroll"}
              as="p"
              fontSize="md"
              marginTop="2"
            >
              {input}
            </Text>
            <HStack
              marginTop="2"
              spacing="2"
              display="flex"
              alignItems="center"
            >
              <Text fontWeight="medium">Venketesh Rushi</Text>
              <Text fontWeight={"semibold"}>—</Text>
              <Text>{new Date().toLocaleDateString()}</Text>
            </HStack>
          </Box>
        </WrapItem>
      </Box>
    </>
  );
}

export default Writeblog;
