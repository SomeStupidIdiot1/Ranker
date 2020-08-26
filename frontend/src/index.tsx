import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import theme from "./components/theme";
document.title = "RankEZ";
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
