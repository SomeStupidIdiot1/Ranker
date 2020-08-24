import React from "react";
import { setTitleType } from "../App";
import {
  Theme,
  createStyles,
  makeStyles,
  Container,
  Typography,
  Grid,
  TextField,
  Link,
  Button,
} from "@material-ui/core";
import { login } from "../../services/login";
import PopUp from "../helpers/PopUp";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    extraInfo: {
      color: theme.palette.info.main,
    },
  })
);

export default ({ setTitle }: { setTitle: setTitleType }) => {
  const classes = useStyles();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState("");
  React.useEffect(() => {
    setTitle("Login");
  }, [setTitle]);
  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!email) {
      setErr("Can't have empty email");
    } else if (!password) {
      setErr("Can't have empty password");
    } else
      login(email, password)
        .then(({ data }) => {
          window.localStorage.setItem("login_token", data.token);
          setEmail("");
          setPassword("");
        })
        .catch((e) => {
          if (e.response) {
            const status = e.response.status;
            setErr(`Error code ${status}`);
          }
        });
  };
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            autoFocus
            color="secondary"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={password}
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            color="secondary"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2" className={classes.extraInfo}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2" className={classes.extraInfo}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <PopUp severity="error" message={err} setMessage={setErr} />
    </Container>
  );
};
