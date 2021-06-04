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
  };
};

const Exhibit: React.VFC<Props> = (props) => {
  const { exhibit } = props;
  return (
    <Box h={100} w={350} backgroundColor='white' borderRadius='lg'>
      <Heading as="h1">{exhibit.name}</Heading>
      <Flex justify="space-between"  align='center'>
      <Avatar src="https://bit.ly/broken-link" />
      <Box>{exhibit.userName}</Box>
      <Box>{exhibit.createdAt}</Box>
      <Box>{exhibit.likes}</Box>
      </Flex>
    </Box>
  );
};

export default Exhibit;
