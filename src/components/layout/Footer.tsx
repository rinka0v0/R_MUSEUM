import Link from "next/link";
import { Box, Flex, HStack } from "@chakra-ui/layout";
import React from "react";

const Footer: React.VFC = () => {
  return (
    <Box as="footer" w="100%" mb={5}>
      <Flex justify="">
        <Box mx="auto">
          <HStack>

          <Link href="/terms">利用規約</Link>
          <Link href="/privacy">プライバシーポリシー</Link>
          </HStack>
        </Box>
      </Flex>
      <Box textAlign="center" fontSize="sm">
        &copy; since 2021 rinka All rights reserved
      </Box>
    </Box>
  );
};

export default Footer;
