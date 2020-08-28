import { SnackbarProps } from "@material-ui/core";
import { AlertProps } from "@material-ui/lab/Alert";
export type inputProps = {
  severity?: AlertProps["severity"];
  title?: string;
  variant?: AlertProps["variant"];
  autoHideDuration?: SnackbarProps["autoHideDuration"];
  message: string;
  setMessage: (msg: string) => void;
};
