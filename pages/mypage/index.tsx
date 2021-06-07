import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import React from "react";
import PrimaryButton from "../../components/atoms/button/PrimaryButton";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";


const Mypage: React.VFC = () => {
  return (
    <>
      <Header isLogin={true} />
      <Flex alignItems="center" flexDirection="column" maxH="1000px">
      <Flex justify='flex-end'>
        <PrimaryButton>プロフィール編集</PrimaryButton>
      </Flex>
        <Flex
          w={{ md: "90%" }}
          alignItems="center"
          my={10}
          justify="space-around"
          flexDirection={{ base: "column", md: "row" }}
        >
          <Avatar
            src="https://bit.ly/broken-link"
            size="2xl"
            mr={3}
            ml={3}
            mt={5}
          />
          <Box width="70%">
            <Box fontSize={30}>rinka</Box>
            <Box as="p" fontSize={{ base: ".95em", md: "16px" }}>
              自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介自己紹介
            </Box>
          </Box>
        </Flex>
        <Heading fontSize={24} textAlign="center">
          rinkaさんの作品
        </Heading>
      </Flex>
      <Footer />
      <></>
    </>
  );
};

export default Mypage;
