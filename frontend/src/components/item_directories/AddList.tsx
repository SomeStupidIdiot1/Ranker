import React from "react";
import {
  Theme,
  createStyles,
  makeStyles,
  Container,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import PopUp from "../helpers/PopUp";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
);
export default () => {
  const classes = useStyles();
  const [templateName, setTemplateName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [message, setMessage] = React.useState("");
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Create a Template
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Title"
            onChange={(e) => setTemplateName(e.target.value)}
            value={templateName}
            autoFocus
            color="secondary"
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            value={desc}
            label={`Description (${300 - desc.length} characters remaining)`}
            placeholder="300 characters max"
            onChange={(e) => setDesc(e.target.value.substring(0, 300))}
            color="secondary"
            rows={7}
            rowsMax={10}
            multiline
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
      </div>
      <PopUp severity="error" message={message} setMessage={setMessage} />
    </Container>
  );
};
