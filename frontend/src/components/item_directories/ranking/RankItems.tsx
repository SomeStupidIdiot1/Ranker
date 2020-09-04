import React from "react";
import reactRouterDom, { useHistory } from "react-router-dom";
import {
  RankItems,
  getRankingItems,
  rankItems,
} from "../../../services/ranking";
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
  button: {
    marginTop: theme.spacing(6),
  },
}));
export default ({ match }: { match: reactRouterDom.match }) => {
  const templateId = (match.params as { id: string | number }).id;
  const [items, setItems] = React.useState<RankItems | null>(null);
  const [message, setMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const classes = useStyles();
  const history = useHistory();

  React.useEffect(() => {
    getRankingItems(templateId)
      .then(({ data }) => setItems(data))
      .catch(() => setMessage("This template cannot be ranked"));
  }, [templateId]);
  const handleSelect = (itemId: string | number) => () => {
    setIsLoading(true);
    const wonId = itemId;
    const lostId =
      (items as RankItems).item1.id === wonId
        ? (items as RankItems).item2.id
        : (items as RankItems).item1.id;
    rankItems(templateId, wonId, lostId)
      .then(() => getRankingItems(templateId))
      .then(({ data }) => {
        setItems(data);
        setIsLoading(false);
      })
      .catch(() => setMessage("This template cannot be ranked"));
  };
  const makeCard = (item: RankItems["item1"] | RankItems["item2"]) => {
    return (
      <Grid item xs={12} sm={6}>
        <Card variant="elevation" elevation={5} className={classes.root}>
          <Box className={classes.border} border={2}>
            <CardActionArea
              style={{ height: "100%" }}
              onClick={handleSelect(item.id)}
            >
              {item.imageUrl && (
                <img
                  alt={item.imageName}
                  src={item.imageUrl as string}
                  style={{ maxHeight: 800, width: "100%" }}
                />
              )}
              {!item.imageUrl && (
                <Typography align="center" component="h3" variant="h2" noWrap>
                  {item.imageName}
                </Typography>
              )}
            </CardActionArea>
          </Box>
        </Card>
      </Grid>
    );
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
            Click the one you think is better
          </Typography>
          {!isLoading && (
            <>
              <Grid container spacing={6} justify="flex-start">
                {items && (
                  <>
                    {makeCard(items.item1)}
                    {makeCard(items.item2)}
                  </>
                )}
              </Grid>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                className={classes.button}
                onClick={() => history.push(`/rankings/${templateId}`)}
              >
                Stop Ranking
              </Button>
            </>
          )}
        </>
      )}
    </Page>
  );
};
