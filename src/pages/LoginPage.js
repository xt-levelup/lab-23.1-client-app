import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { authSliceActions } from "../store/authSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [dataServer, setDataServer] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => {
    return state.authSlice.auth;
  });
  const userData = useSelector((state) => {
    return state.authSlice.userData;
  });

  const emailHandle = (event) => {
    setEmail(event.target.value);
  };

  const passwordHandle = (event) => {
    setPassword(event.target.value);
  };

  const loginPost = async (event) => {
    event.preventDefault();
    const response = await fetch("https://lab-23-1-server.onrender.com/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();
    console.log("data login:", data);

    if (!response.ok) {
      console.log(
        data && data.message
          ? data.message
          : data && data.msg
          ? data.msg
          : "Login not response.ok"
      );
      setErrorMessage(
        data && data.message
          ? data.message
          : data && data.msg
          ? data.msg
          : "Login not response.ok"
      );
      return;
    } else {
      setEmail("");
      setPassword("");
      console.log("Login ok data:", data);
      dispatch(authSliceActions.authUpdate(true));
      dispatch(authSliceActions.userDataUpdate(data));
      setErrorMessage(null);
      navigate("/");
    }
  };

  useEffect(() => {
    console.log("email:", email);
  }, [email]);
  useEffect(() => {
    console.log("password:", password);
  }, [password]);
  useEffect(() => {
    console.log("auth:", auth);
  }, [auth]);
  useEffect(() => {
    console.log("userData:", userData);
  }, [userData]);
  useEffect(() => {
    console.log("errorMessage:", errorMessage);
  }, [errorMessage]);

  return (
    <div
      style={{
        maxWidth: "1200px",
        // border: "1px solid green ",
        margin: "1em auto",
        marginLeft: "3em",
      }}
    >
      <form style={{ marginLeft: "3em" }} onSubmit={loginPost}>
        {errorMessage && <p>{errorMessage}</p>}
        <div>
          <label>Your Email</label>
          <input type="email" onChange={emailHandle} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" onChange={passwordHandle} />
        </div>
        <button type="submit" style={{ cursor: "pointer" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
