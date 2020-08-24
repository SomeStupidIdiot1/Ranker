import React from "react";
import { Snackbar, SnackbarProps } from "@material-ui/core";
import Alert, { AlertProps } from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

type inputProps = {
  severity?: AlertProps["severity"];
  title?: string;
  variant?: AlertProps["variant"];
  autoHideDuration?: SnackbarProps["autoHideDuration"];
  message: string;
  setMessage: (msg: string) => void;
};
export default (props: inputProps) => {
  if (props.message)
    return (
      <Snackbar
        autoHideDuration={props.autoHideDuration || 5000}
        open={!!props.message}
        onClose={() => {
          props.setMessage("");
        }}
        onExited={() => {
          props.setMessage("");
        }}
        message={props.message}
      >
        <Alert variant={props.variant} severity={props.severity}>
          {props.title && <AlertTitle>{props.title}</AlertTitle>}
          {props.message}
        </Alert>
      </Snackbar>
    );
  return null;
};
