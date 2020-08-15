import { createMuiTheme } from "@material-ui/core/styles";
import {
  amber,
  deepPurple,
  purple,
} from "@material-ui/core/colors";

export default createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: deepPurple[900],
    },
    secondary: {
      main: purple[500],
    },
    background: {
      paper: "#2c2c3c",
      default: "#1c1c1e",
    },
    info: {
      main: amber[900],
    },
  },
});