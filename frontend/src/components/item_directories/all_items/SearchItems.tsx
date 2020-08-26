import React from "react";
import { setTitleType } from "../../App";

export default ({ setTitle }: { setTitle: setTitleType }) => {
  React.useEffect(() => {
    setTitle("Community Templates");
  }, [setTitle]);
  return <div></div>;
};
