import React from "react";
import { Route, Routes } from "react-router-dom";
import Blogs from "./Blogs";
import Forgetpassword from "./Forgetpassword";
import LoginCard from "./LoginCard";
import Navbar from "./Navbar";
import { Private, Privaterole } from "./Private";
import SignupCard from "./SignupCard";
import Writeblog from "./Writeblog";
import Yourblogs from "./Yourblogs";

function AllRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/blogs"
          element={
            <Private>
              <Blogs />
            </Private>
          }
        />
        <Route
          path="/writeblog"
          element={
            <Private>
              <Writeblog />
            </Private>
          }
        />
        <Route
          path="/yourblogs"
          element={
            <Private>
              <Yourblogs />
            </Private>
          }
        />
        <Route path="/login" element={<LoginCard />}></Route>
        <Route path="/" element={<SignupCard />}></Route>
        <Route path="/resetpassword" element={<Forgetpassword />}></Route>
      </Routes>
    </>
  );
}

export default AllRoutes;
