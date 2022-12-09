import {
  Box,
  Heading,
  Text,
  HStack,
  WrapItem,
  useToast,
  Button,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { setToast } from "../Utils/extraFunctions";
import { useDispatch } from "react-redux";
import { logoutAPI } from "../redux/authentication/auth.action";
import { useNavigate } from "react-router-dom";

export default function () {
  const [data, setdata] = useState([]);
  const toast = useToast();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [totalpages, setTotalPages] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    let user = Cookies.get("role");
    if (user !== "blogger") {
      setToast(toast,"To See Your Blogs You Have To Login As Blogger", "error")
      navigate("/blogs");
    } else {
      fetchdata();
    }
  }, [page]);

  async function fetchdata() {
    let jwt = Cookies.get("jwttoken");
    let userid = Cookies.get("userid");
    try {
      let res = await axios.get("http://localhost:8080/blog/yourblogs", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        params: {
          page: page,
          userid: userid,
        },
      });
      setdata(res.data.blogs);
      let count = Math.ceil(+res.data.blogscount / 9);
      setTotalPages(count);
    } catch (error) {
      try {
        if (error.response.status === 400) {
          let refreshtoken = Cookies.get("refreshtoken");
          let res1 = await axios.post("http://localhost:8080/user/refresh", {
            headers: {
              Authorization: "Bearer " + refreshtoken + " " + jwt,
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
          axios
            .get("http://localhost:8080/blog/yourblogs", {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
              params: {
                page: page,
              },
            })
            .then((res) => {
              setdata(res.data.blogs);
              let count = Math.ceil(+res.data.blogscount / 9);
              setTotalPages(count);
            })
            .catch((error) =>
              setToast(toast, error.response.data.message, "error")
            );
        }
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
  }

  const handledelete = (id) => {
    try {
      let response = axios.delete(`http://localhost:8080/blog/deleteblog`, {
        params: {
          id: id,
        },
      });
      setToast(toast, "Blog Deleted Successfully", "success");
      fetchdata();
    } catch (error) {
      setToast(toast, error.response.data.message, "error");
    }
  };
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
        minHeight={"84.5vh"}
        bg={useColorModeValue('gray.50', 'gray.900')}
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
            color="white"
            border={"1px solid"}
            display={"block"}
            height={"auto"}
            bgColor={"gray.800"}
          >
            <Box textAlign={"justify"} w="100%">
              <Heading fontSize="xl" marginTop="2">
                <Text
                  maxHeight={"60px"}
                  overflowY={"scroll"}
                  textDecoration="none"
                  _hover={{ textDecoration: "none" }}
                  sx={{
                    "&::-webkit-scrollbar": {
                      width: "8px",
                      borderRadius: "8px",
                      backgroundColor: `rgb(23,25,35)`,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      border: "1px solid rgb(23,25,35)",
                      height: "5px",
                      backgroundColor: `rgb(26,32,44)`,
                    },
                  }}
                >
                  {ele.title}
                </Text>
              </Heading>
              <Text
                maxHeight={"90px"}
                scrollBehavior={"smooth"}
                overflowY={"scroll"}
                as="p"
                fontSize="md"
                marginTop="2"
                sx={{
                  "&::-webkit-scrollbar": {
                    width: "8px",
                    borderRadius: "8px",
                    backgroundColor: `rgb(23,25,35)`,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    border: "1px solid rgb(23,25,35)",
                    height: "5px",
                    backgroundColor: `rgb(26,32,44)`,
                  },
                }}
              >
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
              <Button
                onClick={() => handledelete(ele._id)}
                display={"block"}
                margin={"auto"}
                marginTop={5}
                variant={"outline"}
                colorScheme={"red"}
                _hover={{
                  bgGradient: "linear(to-r, red.400,pink.400)",
                  boxShadow: "xl",
                  color: "white",
                }}
              >
                Delete
              </Button>
            </Box>
          </WrapItem>
        ))}
      </Box>
      <Stack bg={useColorModeValue("gray.50", "gray.900")} pt={4} pb={2}>
        <Stack maxWidth={"max-content"} m={"auto"} direction={"row"}>
          {" "}
          <Button
            variant="outline"
            bg={useColorModeValue("white", "gray.900")}
            color={useColorModeValue("gray.900", "whiteAlpha.900")}
            fontWeight={"bold"}
            _hover={{
              border: "2px solid",
            }}
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            prev
          </Button>
          <Button
            variant="outline"
            bg={useColorModeValue("white", "gray.900")}
            color={useColorModeValue("gray.900", "whiteAlpha.900")}
            fontWeight={"bold"}
            _hover={{
              border: "2px solid",
            }}
          >
            {page}
          </Button>
          <Button
            variant="outline"
            bg={useColorModeValue("white", "gray.900")}
            color={useColorModeValue("gray.900", "whiteAlpha.900")}
            fontWeight={"bold"}
            _hover={{
              border: "2px solid",
            }}
            disabled={page === totalpages}
            onClick={() => setPage(page + 1)}
          >
            next
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
