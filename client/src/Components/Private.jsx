import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setToast } from "../Utils/extraFunctions";

export const Private = ({ children }) => {
  const isAuthenticated = useSelector(
    (state) => state.auth.data.isAuthenticated
  );

  return !isAuthenticated ? <Navigate to={"/login"} /> : children;
};

export const Privaterole = ({ children, toast }) => {
  const role = useSelector((state) => state.auth.data.role);

  if (role === "blogger") {
    setToast(toast, "You Are Authorized", "success");
    return children;
  } else {
    setToast(toast, "You have to Login As Blogger", "error");
    return <Navigate to={"/"} />;
  }
};
