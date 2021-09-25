import React, { useState } from "react";
import Link from "next/link";
import { Flex } from "@chakra-ui/layout";
import { Box, Heading } from "@chakra-ui/react";
import Header from "../components/layout/Header";
import { db } from "../firebase";
import { useEffect } from "react";

const SerchPage: React.VFC = () => {
  const perPage = 64;
  const [tagsName, setTagsName] = useState<Array<string>>([]);

  const fetchTagNames = async () => {
    const tagsRef = await db
      .collection("tags")
      .orderBy("name")
      .limit(perPage)
      .get();
    const tagsNameArray: Array<string> = [];
    tagsRef.forEach((ref) => {
      tagsNameArray.push(ref.data().name);
    });
    setTagsName(tagsNameArray);
  };

  useEffect(() => {
    fetchTagNames();
  }, []);

  return (
    <>
      <Header />
      <Flex align="center" justify="center" flexDirection="column">
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
              md: `calc(${25 * (4 - (tagsName.length % 4))}%)`,
              base: `calc(${50 * (2 - (tagsName.length % 2))}%)`,
            },
          }}
        >
          {tagsName.map((tagName, index) => {
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
                      {tagName}
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
