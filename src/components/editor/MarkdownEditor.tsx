import React from "react";
import dynamic from "next/dynamic";
import firebase from "firebase";
import "easymde/dist/easymde.min.css";
import DOMPurify from "dompurify";
import marked from "marked";
import highlightjs from "highlight.js";
import "highlight.js/styles/github.css";
import { useMemo } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import useMessage from "../../hooks/useMessage";

// クライアント側でインポートする必要がある
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type Props = {
  markdown: string;
  setMarkdown: React.Dispatch<React.SetStateAction<string>>;
  productId: string;
};

marked.setOptions({
  highlight: (code, lang) => {
    return highlightjs.highlightAuto(code, [lang]).value;
  },
});

const MarkdownEditor: React.VFC<Props> = (props) => {
  const { markdown, setMarkdown, productId } = props;
  const { showMessage } = useMessage();

  const imageUploadFunction = (file: any) => {
    // 画像をアップロードする処理
    const storage = firebase.storage();
    const storageRef = storage.ref(`images/${productId}`);
    const imagesRef = storageRef.child(file.name + nanoid(5));
    const upLoadTask = imagesRef.put(file);
    upLoadTask.on(
      "state_changed",
      (snapshot) => {
        console.log("snapshot", snapshot);
      },
      (error) => {
        showMessage({ title: "エラーが発生しました", status: "error" });
        console.log("エラーが発生しました", error);
      },
      () => {
        upLoadTask.snapshot.ref
          .getDownloadURL()
          .then((downloadURL: string) => {
            setMarkdown((preMardown) => {
              return preMardown + `![image](${downloadURL})`;
            });
          })
          .catch(() => {
            showMessage({ title: "エラーが発生しました", status: "error" });
          });
      }
    );
  };

  const autoUploadImage = useMemo(() => {
    return {
      uploadImage: true,
      imageUploadFunction,
    };
  }, []);

  return (
    <Flex
      justify={{ base: "center", md: "space-around" }}
      flexDirection={{ base: "column", md: "row" }}
      
    >
      <Box w={{ base: "100%", md: "45%" }}>
        <SimpleMDE
          value={markdown}
          onChange={(e: string) => {
            setMarkdown(e);
          }}
          options={autoUploadImage}
        />
      </Box>
      <Box w={{ base: "100%", md: "45%" }} borderRadius={5} minH="330px">
        <Heading mb=".5em">プレビュー</Heading>

        <Box bg="white" minH="300px" className="markdown-body" p={5}>
          <Box
            boxSizing="border-box"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(marked(markdown)),
            }}
          ></Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default MarkdownEditor;
