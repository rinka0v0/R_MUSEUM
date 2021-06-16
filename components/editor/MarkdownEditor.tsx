import React from "react";
import dynamic from "next/dynamic";
import { Box, Heading } from "@chakra-ui/layout";
import "easymde/dist/easymde.min.css";
import DOMPurify from "dompurify";
import marked from "marked";

import highlightjs from "highlight.js";
import "highlight.js/styles/github.css";
import "github-markdown-css";
import { Flex } from "@chakra-ui/react";

// クライアント側でインポートする必要がある
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type Props = {
  markdown: string;
  html: string;
  onChangeMarkdown: React.Dispatch<React.SetStateAction<string>>;
  onChangeHTML: React.Dispatch<React.SetStateAction<string>>;
};

marked.setOptions({
  highlight: (code, lang) => {
    return highlightjs.highlightAuto(code, [lang]).value;
  },
  pedantic: false,
  gfm: true,
  breaks: true,
  sanitize: true,
  silent: false,
});

const MarkdownEditor: React.VFC<Props> = (props) => {
  const { markdown, html, onChangeMarkdown, onChangeHTML } = props;

  // const handleDrop = (data: CodeMirror.Editor, e: DragEvent) => {
  //   const files = e.dataTransfer?.files;
  //   if (files && files?.length > 0) {
  //     const file = files[0];
  //     alert("FileName :" + file.name);
  //     console.log(file);
  //   }
  // };
  return (
    <Flex
      justify={{ base: "center", md: "space-around" }}
      flexDirection={{ base: "column", md: "row" }}
    >
      <Box w={{ base: "100%", md: "45%" }}>
        <SimpleMDE
          value={markdown}
          onChange={(e: string) => {
            onChangeMarkdown(e);
            onChangeHTML(DOMPurify.sanitize(marked(e)));
          }}
          // events={{ drop: handleDrop }}
        />
      </Box>
      <Box
        w={{ base: "100%", md: "45%" }}
        borderRadius={5}
        minH='330px'
      >
        <Heading mb='.5em'>プレビュー</Heading>

        <Box bg="white" minH="300px" className="markdown-body" p={5}>
          <Box
            boxSizing="border-box"
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          ></Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default MarkdownEditor;
