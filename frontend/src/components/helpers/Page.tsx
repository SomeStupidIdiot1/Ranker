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
  containerStyles?: (theme: Theme) => CreateCSSProperties;
  paperStyles?: (theme: Theme) => CreateCSSProperties;
  maxWidth?: ContainerTypeMap["props"]["maxWidth"];
}
const useStyles = makeStyles((theme: Theme) => {
  const paperStyles = (props: Props) =>
    props.paperStyles ? props.paperStyles(theme) : undefined;
  const containerStyles = (props: Props) =>
    props.containerStyles ? props.containerStyles(theme) : undefined;
  return {
    paper: (props: Props) => ({
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      ...paperStyles(props),
    }),
    container: (props: Props) => ({ ...containerStyles(props) }),
  };
});
export default (props: Props) => {
  const classes = useStyles(props);
  return (
    <Container
      component="main"
      className={classes.container}
      maxWidth={props.maxWidth !== undefined ? props.maxWidth : "xs"}
    >
      <div className={classes.paper}>{props.children}</div>
    </Container>
  );
};
