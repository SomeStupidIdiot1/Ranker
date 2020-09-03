import React from "react";
import reactRouterDom from "react-router-dom";
import { RankItems, getRankingItems } from "../../../services/ranking";
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
  const classes = useStyles();

  React.useEffect(() => {
    getRankingItems(templateId).then(({ data }) => setItems(data));
  }, [templateId]);
  const makeCard = (item: RankItems["item1"] | RankItems["item2"]) => {
    return (
      <Grid item xs={12} sm={6}>
        <Card variant="elevation" elevation={5} className={classes.root}>
          <Box className={classes.border} border={2}>
            <CardActionArea style={{ height: "100%" }}>
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
      <Typography component="h2" variant="h4" className={classes.title}>
        Click the one you think is better
      </Typography>
      <Grid container spacing={6} justify="flex-start">
        {items ? (
          <>
            {makeCard(items.item1)}
            {makeCard(items.item2)}
          </>
        ) : (
          <Typography>This template cannot be ranked</Typography>
        )}
      </Grid>
      <Button
        variant="contained"
        color="secondary"
        size="large"
        className={classes.button}
      >
        Stop Ranking
      </Button>
    </Page>
  );
};
