import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import Router from "next/router";
import Link from "next/link";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import PrimaryButton from "../../components/atoms/button/PrimaryButton";
import Loading from "../../components/layout/Loading";
import Header from "../../components/layout/Header";

const Mypage: React.VFC = () => {
  const { currentUser, signInCheck } = useContext(AuthContext);

  useEffect(() => {
    !currentUser && Router.push("/");
  }, [currentUser]);

  if (!signInCheck || !currentUser) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <Flex alignItems="center" flexDirection="column" maxH="1000px">
        <Box ml="auto" mr={5} mt={5}>
          <Link href="/mypage/edit">
            <PrimaryButton>プロフィール編集</PrimaryButton>
          </Link>
        </Box>
        <Flex
          w={{ md: "90%" }}
          alignItems="center"
          my={10}
          justify="space-around"
          flexDirection={{ base: "column", md: "row" }}
        >
          <Box>
            <Avatar
              src="https://bit.ly/broken-link"
              size="2xl"
              mx={3}
              my={5}
              display="block"
            />
            <Button>アイコンの変更</Button>
          </Box>
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
      <></>
    </>
  );
};

export default Mypage;
