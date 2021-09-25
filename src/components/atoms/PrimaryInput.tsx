import { Input } from "@chakra-ui/input";
import React from "react";

type Props = {
  placeholder: string;
};

const PrimaryInput: React.VFC<Props> = (props) => {
  return <Input placeholder={props.placeholder} />;
};

export default PrimaryInput;
