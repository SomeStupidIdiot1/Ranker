import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles, Theme } from "@material-ui/core";

export interface DialogInfo {
  title: string;
  desc: string;
  acceptButtonDesc: string;
  rejectButtonDesc: string;
  open: boolean;
  setOpen: (val: boolean) => void;
  onAccept: () => void;
}
const useStyles = makeStyles((theme: Theme) => ({
  button: {
    color: theme.palette.info.main,
  },
}));

export default (props: DialogInfo) => {
  const classes = useStyles();
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={() => props.setOpen(true)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.desc}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => props.setOpen(false)}
            className={classes.button}
          >
            {props.rejectButtonDesc}
          </Button>
          <Button
            onClick={() => {
              props.onAccept();
              props.setOpen(true);
            }}
            className={classes.button}
            autoFocus
          >
            {props.acceptButtonDesc}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
