import { useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setToast } from "../Utils/extraFunctions";

export const Private = ({ children }) => {
  const isAuthenticated = useSelector(
    (state) => state.auth.data.isAuthenticated
  );
  const toast = useToast();
  if (!isAuthenticated) {
    setToast(toast, "You Have To Login To See All Blogs", "error");
    return <Navigate to={"/login"} />;
  } else {
    setToast(toast, "You Are Authorized", "success");
    return children;
  }
};

export const Privaterole = ({ children }) => {
  const toast1 = useToast();
  const role = useSelector((state) => state.auth.data.role);
  if (role === "blogger") {
    setToast(toast1, "You Are Authorized", "success");
    return children;
  } else {
    setToast(toast1, "To Create Blogs Login As Blogger", "error");
    return <Navigate to={"/"} />;
  }
};
