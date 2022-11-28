import { useToast } from "@chakra-ui/react";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Blogs from "./Blogs";
import Home from "./Home";
import LoginCard from "./LoginCard";
import Navbar from "./Navbar";
import { Private, Privaterole } from "./Private";
import SignupCard from "./SignupCard";
import Writeblog from "./Writeblog";

function AllRoutes() {
  const toast = useToast();
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/blogs"
          element={
            <Private toast={toast}>
              <Blogs />
            </Private>
          }
        />
        <Route
          path="/writeblog"
          element={
            <Privaterole toast={toast}>
              <Writeblog />
            </Privaterole>
          }
        />
        <Route path="/home" element={<Home />}></Route>
        <Route path="/login" element={<LoginCard />}></Route>
        <Route path="/" element={<SignupCard />}></Route>
      </Routes>
    </>
  );
}

export default AllRoutes;
