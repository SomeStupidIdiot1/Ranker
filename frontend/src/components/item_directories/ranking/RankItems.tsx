import React from "react";
import reactRouterDom, { useHistory } from "react-router-dom";
import { rankItems } from "../../../services/ranking";
import {
  getSpecificTemplate,
  SpecificTemplate,
} from "../../../services/template";
import Page from "../../helpers/Page";
import {
  Grid,
  Card,
  makeStyles,
  Theme,
  Typography,
  CardActionArea,
  Box,
  Button,
} from "@material-ui/core";
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: "100%",
    minHeight: 400,
  },
  border: {
    height: "100%",
  },
  title: {
    marginBottom: theme.spacing(5),
  },
  buttons: {
    marginTop: theme.spacing(6),
  },
  button: {
    margin: theme.spacing(2),
  },
}));
export default ({ match }: { match: reactRouterDom.match }) => {
  const templateId = (match.params as { id: string | number }).id;
  const [items, setItems] = React.useState<SpecificTemplate["items"]>([]);
  const [template, setTemplate] = React.useState<SpecificTemplate | null>(null);

  const [message, setMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const classes = useStyles();
  const history = useHistory();

  const getRandom = (data?: SpecificTemplate) => {
    let allItems;
    if (!data) allItems = (template as SpecificTemplate).items;
    else allItems = data.items;

    if (allItems.length < 2)
      setMessage("Need at least two items to start ranking");
    else {
      const firstRandom = allItems[~~(Math.random() * allItems.length)];
      let secondRandom = allItems[~~(Math.random() * allItems.length)];
      while (secondRandom.id === firstRandom.id) {
        secondRandom = allItems[~~(Math.random() * allItems.length)];
      }
      setItems([firstRandom, secondRandom]);
    }
  };
  React.useEffect(() => {
    getSpecificTemplate(templateId)
      .then(({ data }) => {
        setTemplate(data);
        getRandom(data);
      })
      .catch(() => setMessage("Could not get template"));
    // eslint-disable-next-line
  }, [templateId]);
  const handleSelect = (itemId: string | number) => () => {
    setIsLoading(true);
    if (items.length > 1) {
      const wonId = itemId;
      const lostId = items[0].id === wonId ? items[1].id : items[0].id;
      rankItems(templateId, wonId, lostId)
        .then(() => {
          getRandom();
          setIsLoading(false);
        })
        .catch(() => setMessage("This template cannot be ranked"));
    }
  };

  return (
    <Page maxWidth="xl">
      {message ? (
        <Typography component="h2" variant="h3">
          {message}
        </Typography>
      ) : (
        <>
          <Typography component="h2" variant="h4" className={classes.title}>
            Click the one you think is better (More accurate rank as you play
            more)
          </Typography>
          {!isLoading && (
            <>
              <Grid container spacing={6} justify="flex-start">
                {items.map(({ id, itemImageUrl, name }) => (
                  <Grid item xs={12} md={6} key={id}>
                    <Box className={classes.border} border={2}>
                      <Card
                        variant="elevation"
                        elevation={5}
                        className={classes.root}
                        style={{ height: "50vh" }}
                      >
                        <CardActionArea
                          style={{ height: "100%" }}
                          onClick={handleSelect(id)}
                        >
                          {itemImageUrl && (
                            <img
                              alt={name}
                              src={itemImageUrl as string}
                              style={{
                                maxHeight: "50vh",
                                display: "block",
                                margin: "auto",
                              }}
                            />
                          )}
                          {!itemImageUrl && (
                            <Typography
                              align="center"
                              component="h3"
                              variant="h2"
                              style={{ wordWrap: "break-word" }}
                            >
                              {name}
                            </Typography>
                          )}
                        </CardActionArea>
                      </Card>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Box component="span" className={classes.buttons}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  className={classes.button}
                  onClick={() => history.push(`/myitems/${templateId}`)}
                >
                  Go back to template
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  className={classes.button}
                  onClick={() => history.push(`/rankings/${templateId}`)}
                >
                  Show Ranking
                </Button>
              </Box>
            </>
          )}
        </>
      )}
    </Page>
  );
};
