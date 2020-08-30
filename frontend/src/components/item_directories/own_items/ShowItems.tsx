import reactRouterDom from "react-router-dom";
import React from "react";
import { Theme, makeStyles, Typography, Grid, Card } from "@material-ui/core";
import {
  getSpecificTemplate,
  SpecificTemplate,
} from "../../../services/template";
import Page from "../../helpers/Page";

const useStyles = makeStyles((theme: Theme) => ({
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
}));
export default ({ match }: { match: reactRouterDom.match }) => {
  const classes = useStyles();
  const [template, setTemplate] = React.useState<SpecificTemplate>({
    title: "Loading...",
    info: "Loading...",
    templateImageUrl: null,
    createdOn: new Date(),
    lastUpdated: new Date(),
    items: [],
  });
  React.useEffect(() => {
    const id = (match.params as { id: string }).id;
    getSpecificTemplate(id).then(({ data }) => {
      setTemplate(data);
    });
  }, [match.params]);
  return (
    <Page
      maxWidth={false}
      paperStyles={(theme: Theme) => ({
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
      })}
      containerStyles={(_) => ({
        display: "grid",
      })}
    >
      <Grid container spacing={2} justify="flex-start" alignItems="flex-end">
        <Grid item xs={12}>
          <Typography component="h1" variant="h4">
            {template.title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography component="p" variant="body1">
            {template.info}
          </Typography>
        </Grid>

        {template &&
          template.items.map(({ id, itemImageUrl }) => (
            <Grid item xs={5} sm={4} md={3} lg={2} key={id}>
              <Card variant="elevation" elevation={5} className={classes.root}>
                <img
                  src={itemImageUrl as string}
                  alt="item for ranking"
                  className={classes.img}
                />
              </Card>
            </Grid>
          ))}
      </Grid>
    </Page>
  );
};
