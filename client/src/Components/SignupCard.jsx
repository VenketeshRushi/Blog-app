import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  Select,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { setToast } from "../Utils/extraFunctions";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { refreshCheck } from "../redux/authentication/auth.action";
import { useDispatch } from "react-redux";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [signUpcreds, setsignUpcreds] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    let refreshtoken = Cookies.get("refreshtoken");
    if (refreshtoken) {
      dispatch(refreshCheck(navigate));
    }
  }, []);

  // async function checkrefrshtoken() {
  //   try {
  //     let jwt = Cookies.get("jwttoken");
  //     let refreshtoken = Cookies.get("refreshtoken");
  //     let response = await axios.post("http://localhost:8080/user/refresh", {
  //       headers: {
  //         Authorization: "Bearer " + refreshtoken + " " + jwt,
  //       },
  //     });
  //     if ((response.data = "Token is good to go!")) {
  //       return navigate("/blogs");
  //     }
  //     Cookies.set("jwttoken", response.data.jwttoken, {
  //       expires: new Date(new Date().getTime() + 60 * 60 * 1000),
  //     });
  //     Cookies.set("userid", response.data.userid, {
  //       expires: new Date(new Date().getTime() + 60 * 60 * 1000),
  //     });
  //     Cookies.set("role", response.data.role, {
  //       expires: new Date(new Date().getTime() + 60 * 60 * 1000),
  //     });
  //     navigate("/blogs");
  //   } catch (error) {
  //     Cookies.remove("jwttoken");
  //     Cookies.remove("refreshtoken");
  //     Cookies.remove("userid");
  //     Cookies.remove("role");
  //     navigate("/");
  //   }
  // }

  const hanldeChange = (e) => {
    const { name, value } = e.target;
    setsignUpcreds({
      ...signUpcreds,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (signUpcreds.role === "") {
      setToast(toast, "Please Select Role", "error");
    }
    console.log(signUpcreds);
    try {
      let response = await axios.post(
        "http://localhost:8080/user/signup",
        signUpcreds
      );
      setToast(toast, "Signup Successfull", "success");
      navigate("/login");
    } catch (error) {
      setToast(toast, error.response.data.message, "error");
      console.log(error);
    }
  };
  return (
    <Flex
      minH={"92.5vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"} >
            Sign up
          </Heading>
          <Text
            fontSize={"lg"}
            color={'gray.600'}
          >
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="Name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input name="name" onChange={hanldeChange} type="text" />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input name="email" type="email" onChange={hanldeChange} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  name="password"
                  onChange={hanldeChange}
                  type={showPassword ? "text" : "password"}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="Role" isRequired>
              <FormLabel>Role</FormLabel>
              <Select
                name={"role"}
                placeholder="Select Your Role"
                onChange={hanldeChange}
              >
                <option value="user">User</option>
                <option value="blogger">Blogger</option>
              </Select>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                bgGradient="linear(to-r, red.400,pink.400)"
                _hover={{
                  bgGradient: "linear(to-r, red.400,pink.400)",
                  boxShadow: "xl",
                }}
                onClick={handleSubmit}
              >
                Sign up
              </Button>
            </Stack>
            <Stack>
              <Box
                justifyContent={"center"}
                alignItems={"center"}
                display={"flex"}
              >
                Already a user?{" "}
                <Link to={"/login"}>
                  <Text
                    ml={1}
                    textDecorationLine={"underline"}
                    color={"blue.400"}
                  >
                    Login
                  </Text>
                </Link>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
