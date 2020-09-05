import React from "react";
import Page from "./helpers/Page";
import { Typography } from "@material-ui/core";

export default () => {
  return (
    <Page maxWidth="md">
      <Typography component="h2" variant="h6">
        What this is about
      </Typography>
      <Typography
        component="h2"
        variant="body1"
        style={{ width: "100%" }}
        align="left"
      >
        This website allows users to create a list of related images and/or item
        names and provides an easy way for the user to sort it.
      </Typography>
      <br />
      <Typography component="h2" variant="h6">
        How it works
      </Typography>
      <Typography
        component="h2"
        variant="body1"
        align="left"
        style={{ width: "100%" }}
      >
        This website allows users to upload images or input item names. An Elo
        system is used to determine the ranking of each item on the list. Two
        random items on the list are chosen and you get to choose which one is
        better. As you continue to rank items, the Elo of each item becomes more
        representatitve of what you intended it to be.
      </Typography>
      <br />
      <Typography component="h2" variant="h6">
        How to get started
      </Typography>
      <Typography
        component="h2"
        variant="body1"
        align="left"
        style={{ width: "100%" }}
      >
        Make an account → create template → add items → edit items if needed →
        start ranking → view rankings
      </Typography>
    </Page>
  );
};
