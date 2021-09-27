import { Button } from "@chakra-ui/button";
import React, { ReactNode } from "react";
type Props = {
  children: ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
};

const PrimaryButton: React.VFC<Props> = (props) => {
  const { onClick, children, isLoading = false } = props;
  return (
    <Button
      backgroundColor="#7868E6"
      onClick={onClick}
      color="#EDEEF7"
      _hover={{ opacity: 0.8 }}
      isLoading={isLoading}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
