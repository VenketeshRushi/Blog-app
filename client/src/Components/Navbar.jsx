import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutAPI } from "../redux/authentication/auth.action";
import { setToast } from "../Utils/extraFunctions";
import Cookies from "js-cookie";

const Links = [
  { name: "Blogs", path: "/blogs" },
  { name: "Start Writing", path: "/writeblog" },
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
  const isAuthenticated = useSelector(
    (state) => state.auth.data.isAuthenticated
  );
  const role = useSelector((state) => state.auth.data.role);
  console.log(role);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const handlelogout = () => {
    dispatch(logoutAPI());
    setToast(toast, "Logout Successfully", "success");
    Cookies.remove("jwttoken");
    navigate("/");
  };

  return (
    <>
      <Box bg={"gray.800"} color="white" px={4}>
        <Flex h={12} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            variant={"solid"}
            colorScheme={"teal"}
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

          {isAuthenticated ? (
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
            </Flex>
          ) : (
            <Flex alignItems={"center"}>
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
                  mr={4}
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
                  mr={4}
                >
                  SignUp
                </Button>
              </Link>
            </Flex>
          )}
        </Flex>

        {isOpen ? (
          <Box mt={2} pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <Box onClick={onClose} width="max-content" border="1px solid">
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
