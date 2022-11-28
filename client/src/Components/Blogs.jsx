import {
  Box,
  Heading,
  Link,
  Text,
  HStack,
  WrapItem,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { setToast } from "../Utils/extraFunctions";

export default function Blogs() {
  const [data, setdata] = useState();
  const toast = useToast();
  useEffect(() => {
    let jwt = Cookies.get("jwttoken");
    axios
      .get("http://localhost:8080", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((res) => setdata(res.data))
      .catch((error) => setToast(toast, error.response.data.message, "error"));
  }, []);
  return (
    <>
      <Box
        display={"flex"}
        flexDirection="row"
        justifyContent={"space-around"}
        alignItems="flex-start"
        flexWrap={"wrap"}
        gap="10px"
        width={"100%"}
        pt={5}
        minHeight={"92.5vh"}
        bg={"gray.900"}
      >
        {data?.map((ele, index) => (
          <WrapItem
            width={{ base: "100%", sm: "45%", md: "45%", lg: "30%" }}
            boxShadow={
              "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px"
            }
            p={5}
            borderRadius={4}
            key={index}
            bgColor={"gray.800"}
            color="white"
          >
            <Box textAlign={"justify"} w="100%">
              <Heading fontSize="xl" marginTop="2">
                <Link textDecoration="none" _hover={{ textDecoration: "none" }}>
                  {ele.title}
                </Link>
              </Heading>
              <Text as="p" fontSize="md" marginTop="2">
                {ele.description}
              </Text>
              <HStack
                marginTop="2"
                spacing="2"
                display="flex"
                alignItems="center"
              >
                <Text fontWeight="medium">{ele.name}</Text>
                <Text fontWeight={"semibold"}>—</Text>
                <Text>{ele.createdAt.split("T")[0]}</Text>
              </HStack>
            </Box>
          </WrapItem>
        ))}
      </Box>
    </>
  );
}
