import React from "react";
import reactRouterDom, { useHistory } from "react-router-dom";
import Page from "../../helpers/Page";
import {
  getSpecificTemplate,
  SpecificTemplate,
} from "../../../services/template";
import PopUp from "../../helpers/PopUp";
import {
  Typography,
  Card,
  CardContent,
  makeStyles,
  Theme,
  Box,
  Button,
} from "@material-ui/core";
const useStyles = makeStyles((theme: Theme) => ({
  title: { marginBottom: theme.spacing(3) },
  cardInfo: {
    display: "flex",
    flexDirection: "column",
  },
  card: {
    background: theme.palette.primary.main,
  },
  button: {
    margin: theme.spacing(2),
  },
}));
export default ({ match }: { match: reactRouterDom.match }) => {
  const classes = useStyles();
  const history = useHistory();

  const templateId = (match.params as { id: string | number }).id;
  const [template, setTemplate] = React.useState<SpecificTemplate | null>(null);
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    getSpecificTemplate(templateId)
      .then(({ data }) => {
        data.items.sort((a, b) => {
          if (a.elo < b.elo) return 1;
          return -1;
        });
        setTemplate(data);
      })
      .catch(() => {
        setErr("Could not get template rankings");
      });
  }, [templateId]);
  return (
    <Page maxWidth="lg">
      {template && (
        <>
          <Typography component="h2" variant="h3" className={classes.title}>
            {template.title}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            className={classes.button}
            onClick={() => history.push(`/myitems/${templateId}`)}
          >
            Go back to template
          </Button>
          <Box>
            {template.items.map(({ id, name, itemImageUrl, elo }, index) => {
              return (
                <React.Fragment key={id}>
                  <Card
                    variant="elevation"
                    elevation={5}
                    style={{ display: "flex" }}
                    className={classes.card}
                  >
                    <CardContent className={classes.cardInfo}>
                      <Typography component="h3" variant="body1">
                        <b>Rank: {index + 1}</b>
                      </Typography>
                      <Typography component="h3" variant="body1">
                        Name: {name}
                      </Typography>
                      <Typography component="h3" variant="body1">
                        Elo: {elo}
                      </Typography>
                    </CardContent>
                    {itemImageUrl && (
                      <img
                        alt={name}
                        src={itemImageUrl as string}
                        style={{
                          maxHeight: "30vh",
                        }}
                      />
                    )}
                  </Card>
                  <br />
                </React.Fragment>
              );
            })}
          </Box>
        </>
      )}
      <PopUp message={err} setMessage={setErr} />
    </Page>
  );
};
