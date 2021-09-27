import { Box } from "@chakra-ui/react";
import { VFC } from "react";

type Props = {
  tagName: string;
};

const Tag: VFC<Props> = ({ tagName }) => {
  return (
    <Box
      display="inline-block"
      m=".6em"
      p=".6em"
      lineHeight="1"
      textDecoration="none"
      color="#00e"
      backgroundColor="#fff"
      border="1px solid #00e"
      borderRadius="2em"
    >
      {tagName}
    </Box>
  );
};

export default Tag;
