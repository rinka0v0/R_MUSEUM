import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import Link from "next/link";
import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { IconContext } from "react-icons/lib";

type Props = {
  product: {
    id: string;
    title: string;
    authorIconURL: string;
    authorName: string;
    createdAt: string;
    likeCount: number;
  };
};

const ProductListItem: React.VFC<Props> = (props) => {
  const { product } = props;
  return (
    <Link href={`/products/${product.id}`}>
      <Box
        w="350px"
        backgroundColor="white"
        borderRadius="lg"
        p={3}
        cursor="pointer"
      >
        <Heading as="h1" fontSize="md" minH="30px">
          {product.title}
        </Heading>
        <Flex justify="space-between" align="center" mt={3}>
          <Flex alignItems="center">
            <Avatar
              src={
                product.authorIconURL
                  ? product.authorIconURL
                  : "https://bit.ly/broken-link"
              }
              mr={3}
            />
            <Box>{product.authorName}</Box>
          </Flex>
          <Flex>
            <Box>{product.createdAt}</Box>
            <Flex mx={2} alignItems="center">
              <Box>
                <IconContext.Provider value={{ color: "red" }}>
                  <AiFillHeart />
                </IconContext.Provider>
              </Box>
              <Box>{product.likeCount}</Box>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Link>
  );
};
export default ProductListItem;
