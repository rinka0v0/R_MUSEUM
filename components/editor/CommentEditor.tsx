import React, { useContext, useState } from "react";
import dynamic from "next/dynamic";
import { Box } from "@chakra-ui/layout";
import "easymde/dist/easymde.min.css";
import DOMPurify from "dompurify";
import marked from "marked";
import highlightjs from "highlight.js";
import "highlight.js/styles/github.css";
import { Button } from "@chakra-ui/react";
import PrimaryButton from "../atoms/button/PrimaryButton";
import { db } from "../../firebase";
import firebase from "firebase";
import { AuthContext } from "../../auth/AuthProvider";
import useMessage from "../../hooks/useMessage";
import useFetchComment from "../../hooks/useFetchComment";

// クライアント側でインポートする必要がある
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type Props = {
  markdown: string;
  HTML: string;
  productId: string;
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
  const { markdown, HTML, setMarkdown, setHTML, productId } = props;
  const [isMarkdown, setIsMarkdown] = useState(true);

  const { currentUser } = useContext(AuthContext);
  const { showMessage } = useMessage();
  const { mutate } = useFetchComment(productId);

  const onclickMarkdown = () => {
    setIsMarkdown(true);
  };
  const onclickPrewview = () => {
    setIsMarkdown(false);
  };

  const postComment = () => {
    if (markdown) {
      db.collection("products")
        .doc(productId)
        .collection("comments")
        .doc()
        .set({
          userId: currentUser?.uid,
          content: markdown,
          likes: 0,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          setMarkdown("");
          mutate();
          showMessage({ title: "コメントしました！", status: "success" });
        });
    } else {
      showMessage({ title: "コメントできませんでした", status: "error" });
    }
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
    <>
      <Box>
        {isMarkdown ? (
          <Box w="100%">
            <Box mb={3}>
              <Button
                onClick={onclickMarkdown}
                borderRadius={999}
                backgroundColor="#E4FBFF"
                _hover={{ backgroundColor: "#E4FBFF" }}
              >
                Markdown
              </Button>
              <Button
                onClick={onclickPrewview}
                borderRadius={999}
                backgroundColor="transparent"
                _hover={{ backgroundColor: "transparent" }}
              >
                Preview
              </Button>
            </Box>
            <SimpleMDE
              value={markdown}
              placeholder="コメントを書いてみよう"
              onChange={(e: string) => {
                setMarkdown(e);
                setHTML(DOMPurify.sanitize(marked(e)));
              }}
              // events={{ drop: handleDrop }}
            />
          </Box>
        ) : (
          <Box>
            <Box mb={3}>
              <Button
                onClick={onclickMarkdown}
                borderRadius={999}
                backgroundColor="transparent"
                _hover={{ backgroundColor: "transparent" }}
              >
                Markdown
              </Button>
              <Button
                onClick={onclickPrewview}
                borderRadius={999}
                backgroundColor="#E4FBFF"
                _hover={{ backgroundColor: "#E4FBFF" }}
              >
                Preview
              </Button>
            </Box>
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
          </Box>
        )}
        <PrimaryButton onClick={postComment}>コメントする</PrimaryButton>
      </Box>
    </>
  );
};

export default CommentEditor;
