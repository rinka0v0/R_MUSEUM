import { Button } from "@chakra-ui/button";
import React, { ReactNode } from "react";
type Props = {
  onClick?: () => void;
  children: ReactNode;
};

const PrimaryButton: React.VFC<Props> = (props) => {
  const { onClick, children } = props;
  return (
    <Button
      backgroundColor="#7868E6"
      onClick={onClick}
      color="#EDEEF7"
      _hover={{ opacity: 0.8 }}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
