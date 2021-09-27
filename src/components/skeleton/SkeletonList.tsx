import { Box, Flex, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { VFC } from "react";

type Props = {
  skeletonNumber: number;
};

const SkeletonList: VFC<Props> = (props) => {
  const { skeletonNumber } = props;
  return (
    <Flex
      position="relative"
      m="2em 0"
      maxW="960px"
      w="100%"
      flexWrap="wrap"
      justify="space-between"
      _after={{
        content: "''",
        display: "block",
        width: "calc(100% / 2)",
      }}
    >
      {Array(skeletonNumber)
        .fill(0)
        .map((_, index) => {
          return (
            <Box
              key={index}
              m={{ md: "0.5em auto", base: "0.5em auto" }}
              p="0"
              w={{ md: " calc(96%/2)", base: "96%" }}
            >
              <Box m="0 auto" w="350px" bg="white" p="12px">
                <SkeletonText spacing="2" />
                <SkeletonCircle size="10" mt={2} />
              </Box>
            </Box>
          );
        })}
    </Flex>
  );
};

export default SkeletonList;
