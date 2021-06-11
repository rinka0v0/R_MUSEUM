import { Box, Flex, Heading } from "@chakra-ui/layout";
import React from "react";

const Dashbord: React.VFC = () => {
  return (
    <>
      <Flex flexDirection="column" alignItems="center">
        <Heading fontSize={20} my={5}>
          自分の作品一覧
        </Heading>
        <Box
          border="1px solid #ddd"
          w={{ base: "300px", md: "500px" }}
          p={3}
          borderRadius={5}
          bg="white"
        >
          <Box>title</Box>
          <Flex justify="space-around">
            <Box color="red">公開中</Box>
            <Box>10日前</Box>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default Dashbord;
