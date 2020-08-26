import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Tooltip,
} from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Settings from "./account_setup/Settings";
import LoginForm from "./account_setup/LoginForm";
import RegisterForm from "./account_setup/RegisterForm";
import OwnItems from "./item_directories/own_items/OwnItems";
import SearchItems from "./item_directories/all_items/SearchItems";
import SettingsIcon from "@material-ui/icons/Settings";
import SearchIcon from "@material-ui/icons/Search";
import FrontPage from "./FrontPage";
import AddList from "./item_directories/make_template/AddList";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      flexGrow: 1,
    },
    logout: {
      background: theme.palette.warning.main,
    },
  })
);
export default () => {
  const classes = useStyles();
  const loginToken = !!window.localStorage.getItem("login_token");
  return (
    <Router>
      <AppBar position="static">
        <Toolbar component="nav">
          <Typography variant="h5" className={classes.title}>
            RankEZ
          </Typography>

          <Tooltip title="Community Templates">
            <Link to="/search" style={{ textDecoration: "none" }} tabIndex={-1}>
              <IconButton aria-label="community templates">
                <SearchIcon />
              </IconButton>
            </Link>
          </Tooltip>
          {!loginToken ? (
            <>
              <Box pl={2}>
                <Link
                  to="/login"
                  style={{ textDecoration: "none" }}
                  tabIndex={-1}
                >
                  <Button variant="outlined">Login</Button>
                </Link>
              </Box>
              <Box pl={2}>
                <Link
                  to="/register"
                  style={{ textDecoration: "none" }}
                  tabIndex={-1}
                >
                  <Button variant="outlined">Register</Button>
                </Link>
              </Box>
            </>
          ) : (
            <>
              <Link
                to="/create"
                style={{ textDecoration: "none" }}
                tabIndex={-1}
              >
                <Button variant="outlined">Create Template</Button>
              </Link>
              <Box pl={2}>
                <Link
                  to="/myitems"
                  style={{ textDecoration: "none" }}
                  tabIndex={-1}
                >
                  <Button variant="outlined">Your Templates</Button>
                </Link>
              </Box>
              <Box pl={2}>
                <Link to="/" style={{ textDecoration: "none" }} tabIndex={-1}>
                  <Button
                    variant="outlined"
                    className={classes.logout}
                    onClick={() => {
                      window.localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    Logout
                  </Button>
                </Link>
              </Box>
            </>
          )}
          <Link to="/settings" style={{ textDecoration: "none" }} tabIndex={-1}>
            <Tooltip title="Settings">
              <IconButton aria-label="settings button">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Link>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route path="/settings">
          <Settings />
        </Route>
        <Route path="/login">
          <LoginForm />
        </Route>
        <Route path="/register">
          <RegisterForm />
        </Route>
        <Route path="/myitems">
          <OwnItems />
        </Route>
        <Route path="/search">
          <SearchItems />
        </Route>
        <Route path="/create">
          <AddList />
        </Route>
        <Route path="/">
          <FrontPage />
        </Route>
      </Switch>
    </Router>
  );
};
