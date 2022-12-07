import { useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const Private = ({ children }) => {
  const token = useSelector((state) => state.auth.data.token);

  if (!token) {
    return <Navigate to={"/login"} />;
  } else {
    return children;
  }
};

export const Privaterole = ({ children }) => {
  const role = useSelector((state) => state.auth.data.role);
  const token = useSelector((state) => state.auth.data.token);
  if (role === "blogger" && token.length > 0) {
    return children;
  } else {
    return <Navigate to={"/"} />;
  }
};
