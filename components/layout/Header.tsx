import React, { useCallback } from "react";
import NextLink from "next/link";
import { IconButton } from "@chakra-ui/button";
import { SearchIcon } from "@chakra-ui/icons";
import { Box, Flex } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import PrimaryButton from "../atoms/button/PrimaryButton";
import Link from "next/link";

import { nanoid } from "nanoid";
import {
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/popover";

type Props = {
  isLogin: boolean;
};

const Header: React.VFC<Props> = (props) => {
  const { isLogin } = props;

  const onClickBtn = useCallback(() => {
    console.log(nanoid());
  }, []);

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
            <NextLink href={`/products/${nanoid()}/edit`}>
              <PrimaryButton onClick={onClickBtn}>寄贈する</PrimaryButton>
            </NextLink>

            <Popover>
              <PopoverTrigger>
                <Avatar src="https://bit.ly/broken-link" mx={3} />
              </PopoverTrigger>
              <PopoverContent w="150px" mr={5}>
                <PopoverCloseButton />
                <PopoverHeader>Menu</PopoverHeader>
                <PopoverBody p={0}>
                  <Box  border="1px solid #ddd" h='30px'>
                    <Link href="/mypage">マイページ</Link>
                  </Box>
                  <Box border="1px solid #ddd" h='30px'>
                    <Link href="/dashboard">作品の管理</Link>
                  </Box>
                  <Box border="1px solid #ddd" h='30px'>
                    <Link href="">サインアウト</Link>
                  </Box>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <PrimaryButton>ログイン</PrimaryButton>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
