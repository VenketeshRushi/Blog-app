import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  Stack,
  useToast,
  useColorMode,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutAPI } from "../redux/authentication/auth.action";
import { setToast } from "../Utils/extraFunctions";
import Cookies from "js-cookie";
import axios from "axios";
import { DarkModeBtn } from "./DarkModeBtn";

const Links = [
  { name: "Blogs", path: "/blogs" },
  { name: "Start Writing", path: "/writeblog" },
  { name: "Your Blogs", path: "/yourblogs" },
];

const NavLink = ({ name, path }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bgGradient: "linear(to-r, red.400,pink.400)",
      boxShadow: "xl",
    }}
    to={path}
  >
    {name}
  </Link>
);

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = useSelector((state) => state.auth.data.token);
  const { colorMode } = useColorMode();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const handlelogout = () => {
    let jwt = Cookies.get("jwttoken");
    try {
      let res = axios.post("https://blog-app-yz77.onrender.com/user/logout", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setToast(toast, res.data.message, "success");
      Cookies.remove("jwttoken");
      Cookies.remove("refreshtoken");
      Cookies.remove("userid");
      Cookies.remove("role");
      dispatch(logoutAPI());
      navigate("/");
    } catch (error) {
      Cookies.remove("jwttoken");
      Cookies.remove("refreshtoken");
      Cookies.remove("userid");
      Cookies.remove("role");
      dispatch(logoutAPI());
      navigate("/");
    }
  };

  const linkColor = useColorModeValue('gray.800', 'gray.100');

  return (
    <>
      <Box px={4}>
        <Flex
          h={12}
          alignItems={"center"}
          justifyContent={"space-between"}
          bg={useColorModeValue("white", "gray.800")}
          color={useColorModeValue("gray.900", "white")}
          borderBottom={1}
          py={{ base: 2 }}
          px={{ base: 2 }}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.900")}
        >
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            color={"white"}
            variant={"solid"}
            bgGradient="linear(to-r, red.400,pink.400)"
            _hover={{
              bgGradient: "linear(to-r, red.400,pink.400)",
              boxShadow: "xl",
            }}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
          />

          <HStack
            as={"nav"}
            spacing={4}
            display={{ base: "none", md: "flex" }}
            ml={10}
          >
            {Links.map((link) => (
              <NavLink key={link.name} name={link.name} path={link.path}>
                {link.name}
              </NavLink>
            ))}
          </HStack>

          {token ? (
            <Flex alignItems={"center"}>
              <Button
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                variant={"solid"}
                bgGradient="linear(to-r, red.400,pink.400)"
                _hover={{
                  bgGradient: "linear(to-r, red.400,pink.400)",
                  boxShadow: "xl",
                }}
                size={"sm"}
                mr={4}
                onClick={handlelogout}
              >
                Logout
              </Button>
              <Box h={"36px"} bg={colorMode === "Dark" && "Light"}>
                <Center h={"36px"} mr={"30px"} cursor={"pointer"}>
                  <DarkModeBtn />
                </Center>
              </Box>
            </Flex>
          ) : (
            <Flex alignItems={"center"} justifyContent={"space-between"}>
              <Link
                _hover={{
                  textDecoration: "none",
                }}
                to="/login"
              >
                <Button
                  fontSize={"sm"}
                  fontWeight={600}
                  color={"white"}
                  variant={"solid"}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  _hover={{
                    bgGradient: "linear(to-r, red.400,pink.400)",
                    boxShadow: "xl",
                  }}
                  size={"sm"}
                  mr={2}
                  ml={2}
                >
                  Login
                </Button>
              </Link>
              <Link
                _hover={{
                  textDecoration: "none",
                }}
                to="/"
              >
                {" "}
                <Button
                  variant={"solid"}
                  fontSize={"sm"}
                  fontWeight={600}
                  color={"white"}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  _hover={{
                    bgGradient: "linear(to-r, red.400,pink.400)",
                    boxShadow: "xl",
                  }}
                  size={"sm"}
                  mr={1}
                >
                  SignUp
                </Button>
              </Link>
              <Box h={"36px"} bg={colorMode === "Dark" && "Light"}>
                <Center h={"36px"} mr={"15px"} cursor={"pointer"}>
                  <DarkModeBtn />
                </Center>
              </Box>
            </Flex>
          )}
        </Flex>

        {isOpen ? (
          <Box mt={2} pb={4} display={{ md: "none" }}  >
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <Box
                  px={5}
                  py={1}
                  rounded={"md"}
                  _hover={{
                    textDecoration: "none",
                    bgGradient: "linear(to-r, red.400,pink.400)",
                    boxShadow: "xl",
                  }}
                  onClick={onClose}
                  width="max-content"
                  color={linkColor}
                  fontWeight={"500"}
                >
                  {" "}
                  <NavLink key={link.name} name={link.name} path={link.path}>
                    {link.name}
                  </NavLink>
                </Box>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
