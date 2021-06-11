import React from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex } from "@chakra-ui/layout";
import Header from "../../components/layout/Header";

const ProductPage: React.VFC = () => {
  return (
    <Box>
      <Header />
      <Flex alignItems="center" flexDirection="column">
        <Flex alignItems="center" my={5}>
          <Avatar src="https://bit.ly/broken-link" mr={3} ml={3} />
          <Box> name</Box>
        </Flex>
        <Box>
          TitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitleTitle
        </Box>
        <Box bg="white" w="80%" borderRadius={5} p={8} minH="300px" mb={3}>
          testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest
        </Box>
      </Flex>
    </Box>
  );
};

export default ProductPage;
