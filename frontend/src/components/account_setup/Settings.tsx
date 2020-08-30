import React from "react";
import {
  Theme,
  makeStyles,
  Typography,
  Grid,
  TextField,
  Button,
} from "@material-ui/core";
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
}));

export default () => {
  const classes = useStyles();

  return (
    <Page maxWidth="xs">
      <Typography component="h1" variant="h5">
        Settings
      </Typography>
      <form className={classes.form} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Display name"
              autoFocus
              color="secondary"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Email Address"
              color="secondary"
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
          Confirm
        </Button>
      </form>
    </Page>
  );
};
