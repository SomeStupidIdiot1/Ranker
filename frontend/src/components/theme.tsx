import { createMuiTheme } from "@material-ui/core/styles";
import { amber, purple, blue, pink } from "@material-ui/core/colors";

export default createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: blue[200],
    },
    secondary: {
      main: purple[500],
    },
    info: {
      main: amber[900],
    },
    warning: {
      main: pink[100],
    },
  },
});
