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
  Image,
  Avatar,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { setToast } from "../Utils/extraFunctions";
import { useDispatch } from "react-redux";
import { logoutAPI } from "../redux/authentication/auth.action";
import { useNavigate } from "react-router-dom";

export default function Blogs() {
  const [data, setdata] = useState();
  const toast = useToast();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [totalpages, setTotalPages] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchdata();
  }, [page]);

  async function fetchdata() {
    let jwt = Cookies.get("jwttoken");
    try {
      let res = await axios.get("http://localhost:8080/blog", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        params: {
          page: page,
        },
      });
      setdata(res.data.blogs);
      let count = Math.ceil(+res.data.blogscount / 9);
      setTotalPages(count);
      console.log(res);
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
            .get("http://localhost:8080/blog", {
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
  return (
    <>
      <Box
        display={"flex"}
        flexDirection="row"
        justifyContent={"space-around"}
        alignItems="flex-start"
        flexWrap={"wrap"}
        gap="20px"
        width={"100%"}
        pt={5}
        minHeight={"82.5vh"}
        bg={useColorModeValue("gray.50", "gray.900")}
      >
        {data?.map((ele, index) => (
          <WrapItem width={{ base: "100%", sm: "45%", md: "45%", lg: "30%" }}>
            <Box w="90%" margin={"auto"}>
              <Box borderRadius="lg" overflow="hidden" maxHeight={"300px"}>
                <Image
                  transform="scale(1.0)"
                  src={ele.img}
                  alt="some text"
                  objectFit="contain"
                  width="100%"
                  transition="0.3s ease-in-out"
                  _hover={{
                    transform: "scale(1.05)",
                  }}
                />
              </Box>
              <Heading fontSize="xl" marginTop="2">
                <Text
                  maxHeight={"60px"}
                  scrollBehavior={"smooth"}
                  overflowY={"scroll"}
                  sx={{
                    "&::-webkit-scrollbar": {
                      width: "6px",
                      borderRadius: "8px",
                      border: "1px solid rgb(27,32,44)",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      height: "4px",
                      borderRadius: "8px",
                      backgroundColor: `gray.900`,
                    },
                  }}
                >
                  {ele.title}
                </Text>
              </Heading>
              <Text
                as="p"
                fontSize="md"
                marginTop="2"
                maxHeight={"60px"}
                scrollBehavior={"smooth"}
                overflowY={"scroll"}
                sx={{
                  "&::-webkit-scrollbar": {
                    width: "6px",
                    borderRadius: "8px",
                    border: "1px solid rgb(27,32,44)",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    height: "4px",
                    borderRadius: "8px",
                    backgroundColor: `gray.900`,
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
                <Avatar size="xs" />
                <Text fontWeight="medium">{ele.name}</Text>
                <Text>—</Text>
                <Text>
                  {ele.createdAt.split("T")[0].replaceAll("-", " / ")}
                </Text>
              </HStack>
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
