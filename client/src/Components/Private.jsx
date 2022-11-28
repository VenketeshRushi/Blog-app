import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setToast } from "../Utils/extraFunctions";

export const Private = ({ children, toast }) => {
  const isAuthenticated = useSelector(
    (state) => state.auth.data.isAuthenticated
  );

  if (!isAuthenticated) {
    setToast(toast, "You Have To Login To See All Blogs", "error");
    return <Navigate to={"/login"} />;
  } else {
    setToast(toast, "You Are Authorized", "success");
    return children;
  }
};

export const Privaterole = ({ children, toast }) => {
  const role = useSelector((state) => state.auth.data.role);

  if (role === "blogger") {
    setToast(toast, "You Are Authorized", "success");
    return children;
  } else {
    setToast(toast, "To Create Blogs Login As Blogger", "error");
    return <Navigate to={"/"} />;
  }
};
