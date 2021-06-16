import React from "react";
import dynamic from "next/dynamic";
import { Box, Heading } from "@chakra-ui/layout";
import "easymde/dist/easymde.min.css";
import DOMPurify from "dompurify";
import marked from "marked";

import highlightjs from "highlight.js";
import "highlight.js/styles/github.css";
import "github-markdown-css";

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
    <>
      <Box w="100%">
        <SimpleMDE
          value={markdown}
          onChange={(e: string) => {
            onChangeMarkdown(e);
            onChangeHTML(DOMPurify.sanitize(marked(e)));
          }}
          // events={{ drop: handleDrop }}
        />
        <Heading my="1em">プレビュー</Heading>
        <Box
          bg="white"
          w="100%"
          borderRadius={5}
          p={8}
          minH="300px"
          mb={3}
          className="markdown-body"
          boxSizing="border-box"
        >
          <Box
            as="span"
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          ></Box>
        </Box>
      </Box>
    </>
  );
};

export default MarkdownEditor;
