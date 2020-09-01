import React from "react";
import {
  Theme,
  makeStyles,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import reactRouterDom from "react-router-dom";

import { getAllTemplates, AllTemplates } from "../../../services/template";

const useStyles = makeStyles((theme: Theme) => ({
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
  title: { textAlign: "center" },
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
  container: {
    display: "grid",
  },
}));
export default ({ match }: { match: reactRouterDom.match }) => {
  const classes = useStyles();
  const [allTemplates, setAllTemplates] = React.useState<AllTemplates>([]);
  React.useEffect(() => {
    getAllTemplates().then(({ data }) => {
      setAllTemplates(data);
    });
  }, []);
  return (
    <Container component="main" maxWidth={false} className={classes.container}>
      <div className={classes.paper}>
        <Grid container spacing={2} justify="flex-start" alignItems="stretch">
          <Grid item xs={12}>
            <Typography component="h1" variant="h5">
              Your Templates
            </Typography>
          </Grid>

          {allTemplates.map(({ id, title, imageUrl }) => (
            <Grid item xs={5} sm={4} md={3} lg={2} key={id}>
              <Card variant="elevation" elevation={5} className={classes.root}>
                <Link
                  to={`${match.path}/${id}`}
                  style={{
                    textDecoration: "none",
                    color: "#FFF",
                  }}
                  tabIndex={-1}
                >
                  <CardActionArea
                    style={{
                      height: "100%",
                    }}
                  >
                    {imageUrl && (
                      <img
                        src={imageUrl as string}
                        alt={title}
                        className={classes.img}
                      />
                    )}
                    <CardContent
                      style={{
                        outline: "none",
                      }}
                    >
                      <Typography
                        className={classes.title}
                        color="textPrimary"
                        variant="h6"
                        component="h2"
                        noWrap
                        style={{ alignSelf: "flex-end" }}
                      >
                        {title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Container>
  );
};
