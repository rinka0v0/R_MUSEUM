import React, { useContext, useMemo, useState } from "react";
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
import { nanoid } from "nanoid";

// クライアント側でインポートする必要がある
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type Props = {
  markdown: string;
  productId: string;
  setMarkdown: React.Dispatch<React.SetStateAction<string>>;
};

marked.setOptions({
  highlight: (code, lang) => {
    return highlightjs.highlightAuto(code, [lang]).value;
  },
});

const CommentEditor: React.VFC<Props> = (props) => {
  const { markdown, setMarkdown, productId } = props;
  const [isMarkdown, setIsMarkdown] = useState(true);

  const { currentUser } = useContext(AuthContext);
  const { showMessage } = useMessage();
  const { mutate } = useFetchComment(productId);
  const [loading, setLoading] = useState(false);

  const postComment = () => {
    setLoading(true);
    if (markdown && !loading) {
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
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      showMessage({ title: "コメントできませんでした", status: "error" });
      setLoading(false);
    }
  };

  const imageUploadFunction = (file: any) => {
    // 画像をアップロードする処理
    const storage = firebase.storage();
    const storageRef = storage.ref(`images/${productId}/comments`);
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
    <>
      <Box>
        <Box w="100%">
          <Box mb={3}>
            <Button
              onClick={() => setIsMarkdown(true)}
              borderRadius={999}
              backgroundColor={isMarkdown ? "#E4FBFF" : "transparent"}
              _hover={{
                backgroundColor: isMarkdown ? "#E4FBFF" : "transparent",
              }}
            >
              Markdown
            </Button>
            <Button
              onClick={() => setIsMarkdown(false)}
              borderRadius={999}
              backgroundColor={isMarkdown ? "transparent" : "#E4FBFF"}
              _hover={{
                backgroundColor: isMarkdown ? "transparent" : "#E4FBFF",
              }}
            >
              Preview
            </Button>
          </Box>
          {isMarkdown ? (
            <SimpleMDE
              value={markdown}
              placeholder="コメントを書いてみよう"
              onChange={(e: string) => {
                setMarkdown(e);
              }}
              options={autoUploadImage}
            />
          ) : (
            <Box w="100%" borderRadius={5} minH="330px" border="1px solid ">
              <Box bg="white" minH="300px" className="markdown-body" p={5}>
                <Box
                  boxSizing="border-box"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(marked(markdown)),
                  }}
                ></Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Box>
        <PrimaryButton
          isLoading={loading}
          onClick={() =>
            currentUser
              ? postComment()
              : showMessage({ title: "ログインしてください", status: "error" })
          }
        >
          コメントする
        </PrimaryButton>
      </Box>
    </>
  );
};

export default CommentEditor;
