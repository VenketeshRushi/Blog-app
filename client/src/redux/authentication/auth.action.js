import {
  AUTH_LOG_IN_SUCCESS,
  AUTH_LOG_IN_ERROR,
  AUTH_LOG_OUT,
} from "./auth.types";
import axios from "axios";
import Cookies from "js-cookie";
import { setToast } from "../../Utils/extraFunctions";

export const loginAPI = (data,toast,navigate) => async (dispatch) => {
  try {
    let response = await axios.post("http://localhost:8080/login", data);
    console.log(response);
    if (response.status === 201) {
      Cookies.set("jwttoken", response.data.jwttoken);
      Cookies.set("refreshtoken", response.data.refreshtoken,);
      setToast(toast, "Login Successfully", "success");
      navigate("/blogs")
    }
    dispatch({
      type: AUTH_LOG_IN_SUCCESS,
      payload:response.data
    });
  } catch (error) {
    dispatch({
      type: AUTH_LOG_IN_ERROR,
    });
    setToast(toast, error.response.data.message, "error");
  }
};

export const logoutAPI = () => ({ type: AUTH_LOG_OUT });
