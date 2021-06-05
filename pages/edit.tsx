import React, { useState } from "react";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import Header from "../components/layout/Header";
import dynamic from "next/dynamic";
import marked from "marked";
import DOMPurify from "dompurify";

import "easymde/dist/easymde.min.css";
import Footer from "../components/layout/Footer";

// クライアント側でインポートする必要がある
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const Edit: React.VFC = () => {
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [html, setHTML] = useState("");

  return (
    <>
      <Header isLogin={true} />
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
        <Input placeholder="sorce code URL" w="80%" />
        <Box mt="3em" width="80%">
          <SimpleMDE
            onChange={(e: string) => {
              // DOMPurify sanitizes HTML
              setHTML(DOMPurify.sanitize(marked(e)));
              setMarkdown(e);
            }}
          />
        </Box>

        <Heading mb="2em">プレビュー</Heading>
        <Box bg="white" w="80%" borderRadius={5} p={8} minH="300px">
          <Box
            as="span"
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          ></Box>
        </Box>
      </Flex>
      <Footer />
    </>
  );
};

export default Edit;
