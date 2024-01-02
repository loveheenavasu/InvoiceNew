import "./Navbar.css";
import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  AppBar,
  Toolbar,
  Typography,
  MenuItem,
  Menu,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { useDispatch } from "react-redux";
import { handleUserLogout } from "../../Store/Slices/Auth";
// import { Grid } from "@mui/material";

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSenderAvailable, setIsSenderAvailable] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const isSender = localStorage.getItem("sender");
    setIsSenderAvailable(isSender);
    const is_login = localStorage.getItem("token");
    {
      is_login ? setIsLogin(true) : setIsLogin(false);
    }
  });

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {
    setAnchorEl(null);
    navigate("/add_Sender");
  };

  const handleLogin = () => {
    if (isLogin) {
      dispatch(handleUserLogout(false));
      localStorage.removeItem("token");
      localStorage.removeItem("sender");
      navigate("/");
    }
  };

  return (
    <div>
      <AppBar className="AppBar">
        <Grid item sm={12} xs={12} className="container">
          <Toolbar>
            <Grid className="grow">
              <Button className="mainLogo">
                <Avatar
                  src="https://zestgeek.com/assets/images/logo.png"
                  className="avatar"
                  sx={{ width: "234px" }}
                />
              </Button>
            </Grid>

            {/* <Button
              color="inherit"
              className="buttonFontSize"
              onClick={() => navigate("/clients")}
            >
              Clients
            </Button> */}
              <Button
              color="inherit"
              className="buttonFontSize"
              onClick={() => navigate("/course")}
            >
              Courses
            </Button>
            <Button
              color="inherit"
              className="buttonFontSize"
              onClick={() => navigate("/student")}
            >
              Students
            </Button>
            {/* <Button
              color="inherit"
              className="buttonFontSize"
              onClick={() => navigate("/invoices")}
            >
              Invoice
            </Button> */}
            <Button
              color="inherit"
              onClick={handleClick}
              className="buttonFontSize"
            >
              Profile
            </Button>
            <Button
              color="inherit"
              className="buttonFontSize"
              onClick={handleLogin}
            >
              {!isLogin ? "Login" : "Logout"}
            </Button>
          </Toolbar>
        </Grid>
      </AppBar>
    </div>
  );
};
