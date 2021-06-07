import { Input, InputGroup, InputLeftAddon } from "@chakra-ui/input";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Textarea } from "@chakra-ui/textarea";
import React, { useState } from "react";
import PrimaryButton from "../../components/atoms/button/PrimaryButton";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";

const EditMyPage: React.VFC = () => {
  const [name, setName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [gitHub, setGitHub] = useState("");

  return (
    <>
      <Header isLogin={true} />
      <Flex alignItems="center" flexDirection="column" maxH="1000px">
        <Flex
          w={{ md: "90%" }}
          alignItems="center"
          my={10}
          justify="space-around"
          flexDirection={{ base: "column", md: "row" }}
        >
          <Box width="70%">
            <Box border="1px solid #ddd" p={3} borderRadius={3}>
              <Text>ユーザー名</Text>
              <Input
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                }}
              />
            </Box>
            <Box border="1px solid #ddd" p={3} borderRadius={3}>
              <Text>自己紹介</Text>
              <Textarea
                value={introduction}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setIntroduction(e.target.value)
                }
                colorScheme="linkedin"
                placeholder="自己紹介を書こう"
                h="250px"
              ></Textarea>
            </Box>
            <Box border="1px solid #ddd" p={3} borderRadius={3}>
              <Text>GitHubのURL</Text>
              <InputGroup>
                <InputLeftAddon>http://github.com/</InputLeftAddon>
                <Input
                  value={gitHub}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setGitHub(e.target.value);
                  }}
                />
              </InputGroup>
            </Box>
            <Box border="1px solid #ddd" p={3} borderRadius={3}>
              <Text>Twitterユーザー名</Text>
              <InputGroup>
                <InputLeftAddon>https://twitter.com/</InputLeftAddon>

                <Input
                  value={twitter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setTwitter(e.target.value);
                  }}
                />
              </InputGroup>
            </Box>
            <Box border="1px solid #ddd" p={3} borderRadius={3}>
              <Text>Instagramユーザー名</Text>
              <InputGroup>
                <InputLeftAddon>https://instagram.com/</InputLeftAddon>
                <Input
                  value={instagram}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setInstagram(e.target.value);
                  }}
                />
              </InputGroup>
            </Box>
            <PrimaryButton>保存</PrimaryButton>
          </Box>
        </Flex>
      </Flex>
      <Footer />
      <></>
    </>
  );
};

export default EditMyPage;
