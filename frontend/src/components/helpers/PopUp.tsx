import React from "react";
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

import { SnackbarProps } from "@material-ui/core";
import { AlertProps } from "@material-ui/lab/Alert";
const isSuccess = "&severity=success";
export interface InputProps {
  severity?: AlertProps["severity"];
  title?: string;
  variant?: AlertProps["variant"];
  autoHideDuration?: SnackbarProps["autoHideDuration"];
  message: string;
  setMessage: (msg: string) => void;
}

export default (props: InputProps) => {
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
        <Alert
          variant={props.variant}
          severity={
            props.message.endsWith(isSuccess) ? "success" : props.severity
          }
        >
          {props.title && <AlertTitle>{props.title}</AlertTitle>}
          {props.message.endsWith(isSuccess)
            ? props.message.substring(
                0,
                props.message.length - isSuccess.length
              )
            : props.message}
        </Alert>
      </Snackbar>
    );
  return null;
};
