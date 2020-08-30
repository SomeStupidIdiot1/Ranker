import React, { ReactNode } from "react";
import {
  Theme,
  makeStyles,
  Container,
  ContainerTypeMap,
} from "@material-ui/core";
import { CreateCSSProperties } from "@material-ui/core/styles/withStyles";
export interface Props {
  children?: ReactNode;
  containerStyles?: CreateCSSProperties;
  paperStyles?: CreateCSSProperties;
  maxWidth?: ContainerTypeMap["props"]["maxWidth"];
}
const useStyles = makeStyles((theme: Theme) => ({
  paper: (props: Props) => ({
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    ...props.paperStyles,
  }),
  container: (props: Props) => ({ ...props.containerStyles }),
}));
export default (props: Props) => {
  const classes = useStyles(props);
  return (
    <Container
      component="main"
      className={classes.container}
      maxWidth={props.maxWidth || "md"}
    >
      <div className={classes.paper}>{props.children}</div>
    </Container>
  );
};
