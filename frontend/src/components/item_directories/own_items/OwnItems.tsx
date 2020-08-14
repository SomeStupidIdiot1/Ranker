import React from "react";
import { setTitleType } from "../../App";

export default ({ setTitle }: { setTitle: setTitleType }) => {
  React.useEffect(() => {
    setTitle("Lists that You Created");
  }, [setTitle]);
  return <div></div>;
};
