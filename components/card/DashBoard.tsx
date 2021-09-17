import { VFC } from "react";
import { Box, Flex } from "@chakra-ui/layout";
import Link from "next/link";

type Props = {
  title: string;
  isOpen: boolean;
  createdAt: string;
  url: string;
};

const DashBoard: VFC<Props> = (props) => {
  const { title, isOpen, createdAt, url } = props;
  return (
    <>
      <Link href={url}>
        <Box
          border="1px solid #ddd"
          w={{ base: "300px", md: "500px" }}
          p={3}
          borderRadius={5}
          bg="white"
        >
          <Box>{title}</Box>
          <Flex justify="space-around">
            <Box color={isOpen ? "red" : "blue"}>
              {isOpen ? "公開" : "非公開"}
            </Box>
            <Box>{createdAt}</Box>
          </Flex>
        </Box>
      </Link>
    </>
  );
};

export default DashBoard;
