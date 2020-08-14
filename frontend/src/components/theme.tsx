import { createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";

export default createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: purple[900],
    },
    secondary: {
      main: purple[600],
    },
    background: {
      paper: "#2c2c3c",
      default: "#1c1c1e",
    },
  },
});
