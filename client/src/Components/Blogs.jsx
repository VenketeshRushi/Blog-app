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
import { useDispatch } from "react-redux";
import { logoutAPI } from "../redux/authentication/auth.action";

export default function Blogs() {
  const [data, setdata] = useState();
  const toast = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchdata();
  }, []);

  async function fetchdata() {
    let jwt = Cookies.get("jwttoken");
    try {
      let res = await axios.get("http://localhost:8080", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setdata(res.data);
    } catch (error) {
      try {
        if (error.response.status === 400) {
          let refreshtoken = Cookies.get("refreshtoken");
          let res1 = await axios.post("http://localhost:8080/refresh", {
            headers: {
              Authorization: "Bearer " + refreshtoken,
            },
          });

          Cookies.set("jwttoken", res1.data.jwttoken);
          jwt = Cookies.get("jwttoken");

          axios
            .get("http://localhost:8080", {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            })
            .then((res) => setdata(res.data))
            .catch((error) =>
              setToast(toast, error.response.data.message, "error")
            );
        }
      } catch (error) {
        setToast(toast, error.response.data.message, "error");
        if (error.response.status === 404) {
          Cookies.remove("jwttoken");
          Cookies.remove("refreshtoken");
          dispatch(logoutAPI());
        }
      }
    }
  }
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
