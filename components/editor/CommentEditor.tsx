import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Box, Heading } from "@chakra-ui/layout";
import "easymde/dist/easymde.min.css";
import DOMPurify from "dompurify";
import marked from "marked";
import highlightjs from "highlight.js";
import "highlight.js/styles/github.css";
import "github-markdown-css";
import { Flex } from "@chakra-ui/react";
import PrimaryButton from "../atoms/button/PrimaryButton";

// クライアント側でインポートする必要がある
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type Props = {
  markdown: string;
  HTML: string;
  setMarkdown: React.Dispatch<React.SetStateAction<string>>;
  setHTML: React.Dispatch<React.SetStateAction<string>>;
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

const CommentEditor: React.VFC<Props> = (props) => {
  const { markdown, HTML, setMarkdown, setHTML } = props;
  const [isMarkdown, setIsMarkdown] = useState(true);

  const onclickMarkdown = () => {
    setIsMarkdown(true);
  };
  const onclickPrewview = () => {
    setIsMarkdown(false);
  };

  // const handleDrop = (data: CodeMirror.Editor, e: DragEvent) => {
  //   const files = e.dataTransfer?.files;
  //   if (files && files?.length > 0) {
  //     const file = files[0];
  //     alert("FileName :" + file.name);
  //     console.log(file);
  //   }
  // };
  return (
    <Box>
      <Flex>
        <PrimaryButton onClick={onclickPrewview}>Preview</PrimaryButton>
        <PrimaryButton onClick={onclickMarkdown}>Markdown</PrimaryButton>
      </Flex>
      {isMarkdown ? (
        <Box w="100%">
          <SimpleMDE
            value={markdown}
            placeholder="コメントをかいてみよう"
            onChange={(e: string) => {
              setMarkdown(e);
              setHTML(DOMPurify.sanitize(marked(e)));
            }}
            // events={{ drop: handleDrop }}
          />
        </Box>
      ) : (
        <Box w="100%" borderRadius={5} minH="330px" border="1px solid ">
          <Box bg="white" minH="300px" className="markdown-body" p={5}>
            <Box
              boxSizing="border-box"
              dangerouslySetInnerHTML={{
                __html: HTML,
              }}
            ></Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CommentEditor;
