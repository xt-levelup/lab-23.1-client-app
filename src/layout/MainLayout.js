import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./MainLayout.module.css";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";

import { authSliceActions } from "../store/authSlice";

const MainLayout = () => {
  const dispatch = useDispatch();

  const auth = useSelector((state) => {
    return state.authSlice.auth;
  });
  const userData = useSelector((state) => {
    return state.authSlice.userData;
  });

  const [currentCookie, setCurrentCookie] = useState(null);

  useEffect(() => {
    if (!auth) {
      Cookies.remove("connect.sid");
    }

    const cookie = Cookies.get()["connect.sid"]
      ? Cookies.get()["connect.sid"].split(":")[1].split(".")[0]
      : null;
    setCurrentCookie(cookie);
  }, [auth]);

  const logoutHandle = async () => {
    const response = await fetch(
      "https://lab-23-1-server.onrender.com/logout",
      {
        // const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: currentCookie,
        }),
      }
    );

    const data = await response.json();
    console.log("Logout data:", data);

    if (!response.ok) {
      console.log("Cannot logout!");
    } else {
      console.log(
        data && data.message
          ? data.message
          : "Posted logout but cannot get data"
      );
      dispatch(authSliceActions.authUpdate(false));
      Cookies.remove("connect.sid");
    }
  };

  useEffect(() => {
    console.log("currentCookie:", currentCookie);
  }, [currentCookie]);
  useEffect(() => {
    console.log("auth:", auth);
  }, [auth]);
  useEffect(() => {
    console.log("userData:", userData);
  }, [userData]);

  return (
    <div>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1em",
        }}
      >
        <div>
          <NavLink
            to="/"
            className={({ isActive }) => {
              return isActive ? styles.active : undefined;
            }}
            end
          >
            MessageNode
          </NavLink>
        </div>
        {!auth && (
          <div style={{ display: "flex", gap: "1em" }}>
            <NavLink
              to="login"
              className={({ isActive }) => {
                return isActive ? styles.active : undefined;
              }}
            >
              {auth ? userData.email : "Login"}
            </NavLink>
            <NavLink
              to="register"
              className={({ isActive }) => {
                return isActive ? styles.active : undefined;
              }}
            >
              Signup
            </NavLink>
          </div>
        )}
        {auth && (
          <div style={{ display: "flex", gap: "1em" }}>
            {userData ? userData.email : undefined}

            <button onClick={logoutHandle} style={{ cursor: "pointer" }}>
              Logout
            </button>
          </div>
        )}
      </nav>
      <Outlet />
    </div>
  );
};

export default MainLayout;
