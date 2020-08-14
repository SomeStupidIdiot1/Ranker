import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Settings from "./account_setup/Settings";
import LoginForm from "./account_setup/LoginForm";
import RegisterForm from "./account_setup/RegisterForm";
import OwnItems from "./item_directories/own_items/OwnItems";
import SearchItems from "./item_directories/all_items/SearchItems";
import SettingsIcon from "@material-ui/icons/Settings";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      flexGrow: 1,
    },
    button: {
      marginLeft: theme.spacing(2),
    },
  })
);
export type setTitleType = (title: string) => void;

export default () => {
  const classes = useStyles();
  const loginToken = !!window.localStorage.getItem("loginToken");
  const [title, setTitle] = React.useState("");
  const setDocumentTitle = (newTitle: string) => {
    setTitle(newTitle);
    document.title = newTitle;
  };
  return (
    <Router>
      <AppBar position="static">
        <Toolbar component="nav">
          <Typography variant="h5" className={classes.title}>
            {title}
          </Typography>
          <Link to="/search" style={{ textDecoration: "none" }}>
            <Button variant="outlined" className={classes.button}>
              Look up pre-existing lists
            </Button>
          </Link>
          {!loginToken ? (
            <>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button variant="outlined" className={classes.button}>
                  Login
                </Button>
              </Link>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <Button variant="outlined" className={classes.button}>
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/myitems" style={{ textDecoration: "none" }}>
              <Button variant="outlined" className={classes.button}>
                Look at your own lists
              </Button>
            </Link>
          )}
          <Link to="/settings" style={{ textDecoration: "none" }}>
            <IconButton aria-label="settings button">
              <SettingsIcon />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route path="/settings">
          <Settings setTitle={setDocumentTitle} />
        </Route>
        <Route path="/login">
          <LoginForm setTitle={setDocumentTitle} />
        </Route>
        <Route path="/register">
          <RegisterForm setTitle={setDocumentTitle} />
        </Route>
        <Route path="/myitems">
          <OwnItems setTitle={setDocumentTitle} />
        </Route>
        <Route path="/search">
          <SearchItems setTitle={setDocumentTitle} />
        </Route>
        <Route path="/">
          <OwnItems setTitle={setDocumentTitle} />
        </Route>
      </Switch>
    </Router>
  );
};
