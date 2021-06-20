import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Router from "next/router";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Heading, HStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import PrimaryButton from "../../../components/atoms/button/PrimaryButton";
import Header from "../../../components/layout/Header";
import { AuthContext } from "../../../auth/AuthProvider";
import Loading from "../../../components/layout/Loading";
import "github-markdown-css";
import TagInput from "../../../components/Input/TagsInput";

// クライアント側でインポートする必要がある
const MarkdownEditor = dynamic(
  () => import("../../../components/editor/MarkdownEditor"),
  {
    ssr: false,
  }
);

const Edit: React.VFC = () => {
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [html, setHTML] = useState("");
  const [sourceCodeUrl, setSourceCodeUrl] = useState("");
  const [tags, setTags] = useState<Array<string>>([]);

  const { currentUser, signInCheck } = useContext(AuthContext);

  const onClickSave = () => {
    console.log();
  };

  const onClickDelete = () => {
    if (confirm("削除しますか？")) {
      console.log("削除");
    }
  };

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
        <Button colorScheme="red" onClick={onClickDelete}>
          {" "}
          削除
        </Button>
        <PrimaryButton onClick={onClickSave}>保存</PrimaryButton>
        <PrimaryButton>公開</PrimaryButton>
      </HStack>

      <Flex flexDirection="column" align="center" w="100%">
        <Heading fontSize={20}>タイトル</Heading>
        <Input
          placeholder="作品のタイトル"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          w="80%"
        />
        <TagInput tags={tags} setTags={setTags} />
        <Heading fontSize={20}>ソースコードのURL</Heading>
        <Input
          placeholder="GitHubなどのURL"
          w="80%"
          value={sourceCodeUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSourceCodeUrl(e.target.value)
          }
        />
        <Box w="100%" mt="4em">
          <MarkdownEditor
            markdown={markdown}
            html={html}
            onChangeMarkdown={setMarkdown}
            onChangeHTML={setHTML}
          />
        </Box>
      </Flex>
    </>
  );
};

export default Edit;
