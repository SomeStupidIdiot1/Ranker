import React from "react";
import reactRouterDom from "react-router-dom";

export default ({ match }: { match: reactRouterDom.match }) => {
  const templateId = (match.params as { id: string | number }).id;

  return <div>ranking {templateId}</div>;
};
