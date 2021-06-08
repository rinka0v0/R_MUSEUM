import { Box, Flex, Link } from "@chakra-ui/layout";
// import Link from "next/link";
import React from "react";

const Footer: React.VFC = () => {
  return (
    <Box as="footer" w="100%" mb={5}>
      <Flex justify="">
        <Box mx="auto">
          <Link href="/terms" mx={3}>
            利用規約
          </Link>
          <Link href="/privacy" mx={3}>
            プライバシーポリシー
          </Link>
        </Box>
      </Flex>
      <Box textAlign="center" fontSize="sm">
        &copy; since 2021 rinka All rights reserved
      </Box>
    </Box>
  );
};

export default Footer;
