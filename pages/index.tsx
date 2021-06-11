import React, { useContext } from "react";
import TrendLanguage from "../components/card/TrendLanguage";
import Exhibit from "../components/card/Exhibit";
import { Box, Flex, Heading, VStack } from "@chakra-ui/layout";
import { AuthContext } from "../auth/AuthProvider";

const IndexPage: React.VFC = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <Box>
      <Flex align="center" justify="center" flexDirection="column">
        <VStack w="100%" spacing={8}>
          <Box w="80%" mt={10}>
            <TrendLanguage languages={["TypeScript", "Go", "React"]} />
          </Box>
          <Heading as="h2" textAlign="center">
            作品一覧
          </Heading>
          <Exhibit
            exhibit={{
              name: "Go で作る....",
              userName: "rinka",
              userIcon: "",
              likes: 0,
              createdAt: "10日前",
            }}
          />
          <Exhibit
            exhibit={{
              name: "TypeScriptで作ったアプリ（React + TypeScript）",
              userName: "rinka",
              userIcon: "",
              likes: 0,
              createdAt: "10日前",
            }}
          />
        </VStack>
      </Flex>
    </Box>
  );
};

export default IndexPage;
