import React from "react";
import { setTitleType } from "../../App";

export default ({ setTitle }: { setTitle: setTitleType }) => {
  React.useEffect(() => {
    setTitle("Look Up Pre-existing Lists");
  }, [setTitle]);
  return <div></div>;
};
