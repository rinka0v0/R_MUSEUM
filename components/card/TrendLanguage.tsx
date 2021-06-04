import { Box, Flex } from "@chakra-ui/layout";
import React from "react";
import { Heading, Progress } from "@chakra-ui/react";

type Props = {
  languages: Array<string>;
};

const TrendLanguage: React.VFC<Props> = (props) => {
  const { languages } = props;
  return (
    <Flex
      border="1px solid #ddd"
      bg="white"
      borderRadius="md"
      p={5}
      justify="center"
      flexDirection="column"
    >
      <Heading as="h1" textAlign="center" fontSize={{ base: "25px" }}>
        よく使われている言語
      </Heading>
      <Flex justify="center" flexDirection="column">
        {languages.map((language, id) => (
          <>
            <Box key={id}>{language}</Box>
            <Progress size="sm" value={30} />
          </>
        ))}
      </Flex>
    </Flex>
  );
};

export default TrendLanguage;
