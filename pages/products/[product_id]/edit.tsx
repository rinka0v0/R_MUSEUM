import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Router from "next/router";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Heading, HStack } from "@chakra-ui/layout";
import marked from "marked";
import DOMPurify from "dompurify";
import "easymde/dist/easymde.min.css";
import { Button } from "@chakra-ui/button";
import PrimaryButton from "../../../components/atoms/button/PrimaryButton";
import Header from "../../../components/layout/Header";
import { AuthContext } from "../../../auth/AuthProvider";
import Loading from "../../../components/layout/Loading";

// クライアント側でインポートする必要がある
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const Edit: React.VFC = () => {
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [html, setHTML] = useState("");
  const [sourceCodeUrl, setSourceCodeUrl] = useState("");

  const { currentUser, signInCheck } = useContext(AuthContext);

  const onClickSave = () => {};

  const onClickDelete = () => {
    if (confirm('削除しますか？')) {
      console.log('削除')
    }
  }

  useEffect(() => {
    !currentUser && Router.push("/");
  }, [currentUser]);

  if (!signInCheck || !currentUser) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <HStack spacing={3} mt={5}>
        <Button colorScheme="red" onClick={onClickDelete}> 削除</Button>
        <PrimaryButton onClick={onClickSave}>保存</PrimaryButton>
        <PrimaryButton>公開</PrimaryButton>
      </HStack>

      <Flex flexDirection="column" align="center">
        <Heading fontSize={20}>タイトル</Heading>
        <Input
          placeholder="作品のタイトル"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          w="80%"
        />
        <Heading fontSize={20}>使用言語</Heading>
        <Input placeholder="使用言語" w="80%" />
        <Heading fontSize={20}>ソースコードのURL</Heading>
        <Input
          placeholder="GitHubなどのURL"
          w="80%"
          value={sourceCodeUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSourceCodeUrl(e.target.value)
          }
        />
        <Box mt="3em" width="80%">
          <SimpleMDE
            onChange={(e: string) => {
              setHTML(DOMPurify.sanitize(marked(e)));
              setMarkdown(e);
            }}
          />
        </Box>

        <Heading my="1em">プレビュー</Heading>
        <Box bg="white" w="80%" borderRadius={5} p={8} minH="300px" mb={3}>
          <Box
            as="span"
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          ></Box>
        </Box>
      </Flex>
    </>
  );
};

export default Edit;
