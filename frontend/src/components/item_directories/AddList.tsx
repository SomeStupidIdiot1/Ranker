import React from "react";
import { setTitleType } from "../App";

export default ({ setTitle }: { setTitle: setTitleType }) => {
  React.useEffect(() => {
    setTitle("Create Template");
  }, [setTitle]);
  return <div></div>;
};
