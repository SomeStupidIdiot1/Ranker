import React from "react";
import reactRouterDom from "react-router-dom";

export type matchParams = {
  id?: number;
};
export default ({ match }: { match: reactRouterDom.match }) => {
  const id = (match.params as matchParams).id;
  if (!id) return <div>404</div>;
  return <div>{id}</div>;
};
