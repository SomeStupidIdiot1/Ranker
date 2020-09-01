import React from "react";
import {
  Theme,
  makeStyles,
  Typography,
  Grid,
  TextField,
  Link,
  Button,
  Popper,
} from "@material-ui/core";
import PopUp from "../helpers/PopUp";
import { register } from "../../services/account";
import { useHistory } from "react-router-dom";
import { HasLoginToken } from "../App";
import Page from "../helpers/Page";

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  extraInfo: {
    color: theme.palette.info.main,
  },
  popper: {
    border: "1px solid",
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
}));

export default ({ setHasLoginToken }: { setHasLoginToken: HasLoginToken }) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [errMsg, setErr] = React.useState("");
  const [passAnchorEl, setPassAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const history = useHistory();
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!name) setErr("Missing name");
    else if (!email) setErr("Missing email");
    else if (getPasswordHelperText().length !== 0)
      setErr("Password does not satisfy requirements");
    else if (!/.+@.+/.test(email) || email.length > 100)
      setErr("Invalid email");
    else {
      register({ username: name, email, password: pass })
        .then((result) => {
          window.localStorage.setItem("login_token", result.data.token);
          setEmail("");
          setPass("");
          setName("");
          setHasLoginToken(true);
          history.push("/myitems");
        })
        .catch((err) => {
          if (err.response) {
            const status = err.response.status;
            setErr(`Error code ${status}. The email might already be taken.`);
          }
        });
    }
  };
  const classes = useStyles();

  const getPasswordHelperText = (): React.ReactElement<typeof Typography>[] => {
    const requiredParameters: React.ReactElement<typeof Typography>[] = [];
    if (pass.toLowerCase() === pass)
      requiredParameters.push(
        <Typography variant="subtitle2" component="p" key="no upper case">
          Needs an uppercase letter.
        </Typography>
      );
    if (pass.length < 8 || pass.length > 40)
      requiredParameters.push(
        <Typography
          variant="subtitle2"
          component="p"
          key="too short or too long"
        >
          Must be between 8 to 40 characters.
        </Typography>
      );
    if (!pass.match(/[#?!@$%^&*-]/))
      requiredParameters.push(
        <Typography variant="subtitle2" component="p" key="no symbol">
          Contains one of the following: #?!@$%^&*-
        </Typography>
      );
    if (!/\d/.test(pass))
      requiredParameters.push(
        <Typography variant="subtitle2" component="p" key="no number">
          Needs at least 1 number.
        </Typography>
      );
    return requiredParameters;
  };
  return (
    <Page maxWidth="xs">
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <form className={classes.form} noValidate onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Display name"
              autoFocus
              color="secondary"
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Email Address"
              color="secondary"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Password"
              type="password"
              color="secondary"
              onFocus={(e) => setPassAnchorEl(e.currentTarget)}
              onBlur={() => setPassAnchorEl(null)}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign Up
        </Button>
        <Grid container justify="flex-end">
          <Grid item>
            <Link
              onClick={() => history.push("/login")}
              variant="body2"
              className={classes.extraInfo}
            >
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </form>
      <Popper
        open={!!passAnchorEl && !!getPasswordHelperText().length}
        anchorEl={passAnchorEl}
        placement="left"
        className={classes.popper}
      >
        {getPasswordHelperText()}
      </Popper>
      <PopUp message={errMsg} severity={"error"} setMessage={setErr} />
    </Page>
  );
};
