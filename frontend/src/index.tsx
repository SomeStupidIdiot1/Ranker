import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { BrowserRouter as Router } from "react-router-dom";

import theme from "./components/theme";
document.title = "EasyRank";
ReactDOM.render(
  <Router>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Router>,
  document.getElementById("root")
);
