import { Box, Flex } from "@chakra-ui/layout";
import Link from "next/link";
import React from "react";

const Footer: React.VFC = () => {
  return (
    <Box as="footer">
      <Box textAlign="center">R_MUSEUM</Box>
      <Flex justify="">
        <Box mx='auto'>
          <Link href="/">利用規約</Link>
          <Link href="/">プライバシーポリシー</Link>
        </Box>
      </Flex>
      <Box textAlign="center" fontSize="sm">
        &copy; since 2021 rinka All rights reserved
      </Box>
    </Box>
  );
};

export default Footer;
