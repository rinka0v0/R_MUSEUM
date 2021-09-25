import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import Link from "next/link";
import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { IconContext } from "react-icons/lib";

type Props = {
  exhibit: {
    name: string;
    userName: string;
    createdAt: string;
    likes: number;
    id: string;
    userIcon?: string;
    sourceCode?: string;
  };
};

const Exhibit: React.VFC<Props> = (props) => {
  const { exhibit } = props;
  return (
    <Link href={`/products/${exhibit.id}`}>
      <Box
        w="350px"
        backgroundColor="white"
        borderRadius="lg"
        p={3}
        cursor="pointer"
      >
        <Heading as="h1" fontSize="md" minH="30px">
          {exhibit.name}
        </Heading>
        <Flex justify="space-between" align="center" mt={3}>
          <Flex alignItems="center">
            <Avatar
              src={
                exhibit.userIcon
                  ? exhibit.userIcon
                  : "https://bit.ly/broken-link"
              }
              mr={3}
            />
            <Box>{exhibit.userName}</Box>
          </Flex>
          {exhibit.sourceCode ? <Box bg="teal">コード公開中</Box> : null}
          <Flex>
            <Box>{exhibit.createdAt}</Box>
            <Flex mx={2} alignItems="center">
              <Box>
                <IconContext.Provider value={{ color: "red" }}>
                  <AiFillHeart />
                </IconContext.Provider>
              </Box>
              <Box>{exhibit.likes}</Box>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Link>
  );
};

export default Exhibit;
