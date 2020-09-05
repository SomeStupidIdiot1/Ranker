import React from "react";
import Page from "./helpers/Page";
import { Typography } from "@material-ui/core";

export default () => {
  return (
    <Page maxWidth="md">
      <Typography component="h2" variant="h6">
        This website allows users to upload images or input item names and
        provides a way to easily sort it.
      </Typography>
      <br />
      <Typography component="h2" variant="h6">
        How it works
      </Typography>
      <Typography component="h2" variant="body1">
        This website allows users to upload images or input item names. An Elo
        system is used to determine the ranking of each item on the list. Two
        random items on the list are chosen and you get to choose which one is
        better. As you continue to rank items, the Elo of each item becomes more
        representatitve of what you intended it to be.
      </Typography>
    </Page>
  );
};
