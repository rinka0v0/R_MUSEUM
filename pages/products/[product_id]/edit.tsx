import React, { useCallback, useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Router, { useRouter } from "next/router";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Heading, HStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import PrimaryButton from "../../../components/atoms/button/PrimaryButton";
import Header from "../../../components/layout/Header";
import { AuthContext } from "../../../auth/AuthProvider";
import Loading from "../../../components/layout/Loading";
import "github-markdown-css";
import TagInput from "../../../components/Input/TagsInput";
import useMessage from "../../../hooks/useMessage";
import { db } from "../../../firebase";
import firebase from "firebase";
import DOMPurify from "dompurify";
import marked from "marked";

// クライアント側でインポートする必要がある
const MarkdownEditor = dynamic(
  () => import("../../../components/editor/MarkdownEditor"),
  {
    ssr: false,
  }
);

const Edit: React.VFC = () => {
  const router = useRouter();
  // product_idを文字列として取り出す
  const query = router.asPath.split("/")[2];

  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [html, setHTML] = useState("");
  const [sourceCodeUrl, setSourceCodeUrl] = useState("");
  const [tags, setTags] = useState<Array<string>>([]);
  const [open, setOpen] = useState(false);

  const { currentUser, signInCheck } = useContext(AuthContext);
  const { showMessage } = useMessage();

  const fetchProduct = async () => {
    await db
      .collection("products")
      .doc(query)
      .get()
      .then(async (product) => {
        if (product.data() !== undefined) {
          const data = await product.data();
          setTitle(data?.title);
          setMarkdown(data?.content);
          setHTML(DOMPurify.sanitize(marked(data?.content)));
        }
      });
  };

  const onClickSave = () => {
    if (title && markdown) {
      db.collection("products")
        .doc(query)
        .set({
          title: title,
          content: markdown,
          userId: currentUser?.uid,
          sorceCode: sourceCodeUrl,
          tagsIDs: tags,
          open: open,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          showMessage({ title: "保存しました", status: "success" });
        });
    } else {
      showMessage({
        title: "タイトルと紹介文を書いてください",
        status: "error",
      });
    }
  };

  const onClickDelete = useCallback(() => {
    if (confirm("削除しますか？")) {
      db.collection("products")
        .doc(query)
        .delete()
        .then(() => {
          router.push("/");
          showMessage({ title: "削除しました", status: "success" });
        })
        .catch((error) => {
          showMessage({ title: error, status: "error" });
        });
    }
  }, []);

  const onClickOpen = useCallback(() => {
    setOpen((pre) => !pre);
  }, []);

  useEffect(() => {
    !currentUser && Router.push("/");
    fetchProduct();
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
        <PrimaryButton onClick={onClickOpen}>
          {open ? "非公開" : "公開"}
        </PrimaryButton>
      </HStack>

      <Flex flexDirection="column" align="center" w="100%">
        <Heading fontSize={20} mt={5} mb={3}>
          タイトル
        </Heading>
        <Input
          placeholder="作品のタイトル"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          w="80%"
        />

        <Heading fontSize={20} my={5} mb={3}>
          ソースコードのURL
        </Heading>
        <Input
          placeholder="GitHubなどのURL"
          w="80%"
          value={sourceCodeUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSourceCodeUrl(e.target.value)
          }
        />

        <Heading fontSize={20} mt={5} mb={3}>
          使用技術(5個まで)
        </Heading>
        <Box width="80%">
          <TagInput tags={tags} setTags={setTags} />
        </Box>
        <Heading fontSize={20} my="2em">
          作品の紹介文
        </Heading>
        <Box w="100%" mb="1em">
          <MarkdownEditor
            markdown={markdown}
            html={html}
            setMarkdown={setMarkdown}
            setHTML={setHTML}
          />
        </Box>
      </Flex>
    </>
  );
};

export default Edit;
