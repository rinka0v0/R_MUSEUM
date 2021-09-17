import React, { useState } from "react";
import Link from "next/link";
import { Flex } from "@chakra-ui/layout";
import { Box, Heading } from "@chakra-ui/react";
import Header from "../components/layout/Header";

const SerchPage: React.VFC = () => {
  // const [keyWord, setKeyWord] = useState("");
  // const onChangeKeyWord = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setKeyWord(e.target.value);
  // };

  const [tags, setTags] = useState(9);

  const tagName = 'Go'

  return (
    <>
      <Header />
      <Flex align="center" justify="center" flexDirection="column">
        {/* <Flex w="80%" justify="space-between" mx="auto" mt={10}>
          <Input
            placeholder="キーワード検索は開発中"
            value={keyWord}
            onChange={(e) => onChangeKeyWord(e)}
            disabled={true}
          />
          <PrimaryButton>検索</PrimaryButton>
        </Flex> */}
        <Heading fontSize="20px" mt="40px">
          タグで検索
        </Heading>

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
            width: {
              md: `calc(${25 * (4 - (tags % 4))}%)`,
              base: `calc(${50 * (2 - (tags % 2))}%)`,
            },
          }}
        >
          {Array(tags)
            .fill(0)
            .map((_, index) => {
              return (
                <Link href={`/tags/${tagName.toLocaleLowerCase()}`} key={index}>
                  <Box
                    m={{ md: "0.5em auto", base: "0.5em auto" }}
                    p="0"
                    w={{ md: " calc(96%/4)", base: "calc(94%/2)" }}
                  >
                    <Box>
                      <Box
                        p=".5em 1em"
                        fontWeight="bold"
                        color="#6091d3"
                        bg="#FFF"
                        border="solid 3px #6091d3"
                        borderRadius="10px"
                        textAlign="center"
                        cursor="pointer"
                      >
                        FirebaseFi
                      </Box>
                    </Box>
                  </Box>
                </Link>
              );
            })}
        </Flex>
      </Flex>
    </>
  );
};

export default SerchPage;
