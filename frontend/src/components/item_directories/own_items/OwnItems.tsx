import React from "react";
import {
  Theme,
  createStyles,
  makeStyles,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@material-ui/core";
import { getTemplate } from "../../../services/template";
import { getList } from "../../../../../backend/src/routes/items/template.d";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    root: {
      height: "100%",
    },
    title: { textAlign: "center", display: "block" },
    desc: { textAlign: "center" },
    content: {
      width: "100%",
    },
    button: {
      marginBottom: theme.spacing(2),
    },
    img: {
      maxHeight: 400,
      width: "100%",
    },
  })
);
export default () => {
  const classes = useStyles();
  const [allTemplates, setAllTemplates] = React.useState<getList>([]);
  React.useEffect(() => {
    getTemplate().then(({ data }: { data: getList }) => {
      setAllTemplates(data);
      console.log(data);
    });
  }, []);
  return (
    <Container component="main" maxWidth={false}>
      <div className={classes.paper}>
        <Grid container spacing={2} justify="flex-start">
          <Grid item xs={12}>
            <Typography component="h1" variant="h5">
              Your Templates
            </Typography>
          </Grid>
          {allTemplates.map(({ id, title, imageUrl }) => (
            <Grid item xs={5} sm={4} md={3} lg={2} key={id}>
              <Card variant="elevation" elevation={5} className={classes.root}>
                {imageUrl && (
                  <img
                    src={imageUrl as string}
                    alt={title}
                    className={classes.img}
                  />
                )}
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textPrimary"
                    variant="h6"
                    component="h2"
                    noWrap
                  >
                    {title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Container>
  );
};
