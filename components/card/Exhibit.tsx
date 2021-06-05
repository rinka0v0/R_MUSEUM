import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import React from "react";

type Props = {
  exhibit: {
    name: string;
    userName: string;
    createdAt: string;
    likes: number;
    userIcon?: string;
    sourceCode?: string;
  };
};

const Exhibit: React.VFC<Props> = (props) => {
  const { exhibit } = props;
  return (
    <Box w={350} backgroundColor="white" borderRadius="lg" p={3}>
      <Heading as="h1" fontSize="md" minH="30px">
        {exhibit.name}
      </Heading>
      <Flex justify="space-between" align="center" mt={3}>
        <Flex alignItems="center">
          <Avatar src="https://bit.ly/broken-link" mr={3} />
          <Box>{exhibit.userName}</Box>
        </Flex>
        {exhibit.sourceCode ? <Box bg="teal">コード公開中</Box> : null}
        <Flex>
          <Box>{exhibit.createdAt}</Box>
          <Box mx={2}>❤︎{exhibit.likes}</Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Exhibit;
