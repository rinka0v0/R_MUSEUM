import React from "react";
import NextLink from "next/link";
import { IconButton } from "@chakra-ui/button";
import { SearchIcon } from "@chakra-ui/icons";
import { Box, Flex } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import PrimaryButton from "../atoms/button/PrimaryButton";
import Link from "next/link";

type Props = {
  isLogin: boolean;
};

const Header: React.VFC<Props> = (props) => {
  const { isLogin } = props;
  return (
    <Flex
      as="nav"
      bg="white"
      align="center"
      justify="space-between"
      height="60px"
    >
      <Box ml={3} fontSize="lg" fontWeight="bold">
        <Link href="/">R_MUSEUM</Link>
      </Box>
      <Flex align="center" mr={3}>
        <NextLink href="/serch">
          <IconButton
            backgroundColor="#ddd"
            aria-label="Search database"
            icon={<SearchIcon />}
            mr={3}
          />
        </NextLink>
        {isLogin ? (
          <>
            <PrimaryButton>寄贈する</PrimaryButton>
            <NextLink href="/mypage">
              <Avatar src="https://bit.ly/broken-link" mr={3} ml={3} />
            </NextLink>
          </>
        ) : (
          <PrimaryButton>ログイン</PrimaryButton>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
