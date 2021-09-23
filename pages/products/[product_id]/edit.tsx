import React, { useCallback, useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Router, { useRouter } from "next/router";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Heading, HStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import PrimaryButton from "../../../components/atoms/button/PrimaryButton";
import { AuthContext } from "../../../auth/AuthProvider";
import Loading from "../../../components/layout/Loading";
import TagInput from "../../../components/Input/TagsInput";
import useMessage from "../../../hooks/useMessage";
import { db } from "../../../firebase";
import firebase from "firebase";
import { Switch, Wrap } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useWarningOnExit } from "../../../hooks/useWarningOnExit";
import "github-markdown-css";

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
  const [tags, setTags] = useState<Array<string>>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const { currentUser, signInCheck } = useContext(AuthContext);
  const { showMessage } = useMessage();

  const [warningExit, setWarningExit] = useState(true);
  useWarningOnExit(warningExit, "ページを離れてもいいですか？");

  const fetchProduct = async () => {
    try {
      const productDoc = await db.collection("products").doc(query).get();
      if (!productDoc.exists) {
        showMessage({
          title: `作品が存在しません`,
          status: "error",
        });
        setWarningExit((prev) => !prev);
        await router.push("/");
      }
      const data = productDoc.data();
      setTitle(data?.title);
      setMarkdown(data?.content);
      setOpen(data?.open);
      setTags(data?.tagsIDs);
    } catch (err) {
      setWarningExit((prev) => !prev);
      router.push("/");
      showMessage({ title: "作品が見つかりませんでした", status: "error" });
    }
  };

  const onClickSave = async () => {
    setSaving(true);
    if (title && markdown) {
      // タグ付けの機能を追加
      if (tags.length) {
        // タグがつけられている場合の処理
        await Promise.all(
          tags.map(async (tagName) => {
            const tagData = await db
              .collection("tags")
              .where("name", "==", tagName.toLocaleLowerCase().trim())
              .get();
            if (tagData.empty) {
              // create tag document
              await db
                .collection("tags")
                .add({
                  name: tagName.toLocaleLowerCase().trim(),
                  count: 0,
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .catch(() => {
                  showMessage({
                    title: "エラーが発生しました",
                    status: "error",
                  });
                  setSaving(false);
                });
            }
          })
        ).catch(() => {
          showMessage({ title: "エラーが発生しました", status: "error" });
          setSaving(false);
        });
      }

      await db.collection("products")
        .doc(query)
        .set(
          {
            title: title,
            content: markdown,
            userId: currentUser?.uid,
            sorceCode: "",
            tagsIDs: tags,
            open: open,
            saved: true,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        )
        .then(() => {
          showMessage({ title: "保存しました", status: "success" });
          if (open) {
            setWarningExit((prev) => !prev);
            router.push(`/products/${query}`);
          }
          setSaving(false);
        })
        .catch(() => {
          showMessage({ title: "エラーが発生しました", status: "error" });
          setSaving(false);
        });
    } else {
      showMessage({
        title: "タイトルと紹介文を書いてください",
        status: "error",
      });
      setSaving(false);
    }
  };

  const onClickDelete = useCallback(() => {
    if (confirm("削除しますか？")) {
      db.collection("products")
        .doc(query)
        .delete()
        .then(() => {
          setWarningExit(false);
          router.push("/");
          showMessage({ title: "削除しました", status: "success" });
        })
        .catch(() => {
          showMessage({ title: "エラーが発生しました", status: "error" });
        });
    }
  }, []);

  const onClickOpen = useCallback(() => {
    setOpen((pre) => !pre);
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setWarningExit(false);
      Router.push("/");
    }
    const fetchProductData = async () => {
      await fetchProduct();
      setLoading(false);
    };
    fetchProductData();
  }, [currentUser]);

  if (!signInCheck || !currentUser || loading) {
    return <Loading />;
  }

  return (
    <>
      <Flex
        alignItems="center"
        justify="space-between"
        flexDirection="column"
        my={5}
        w="100%"
      >
        <Flex
          alignItems="center"
          flexWrap="wrap"
          justify="space-between"
          width="90%"
        >
          <Link href="/dashboard">
            <Flex flexWrap="wrap" align="center" my={2} cursor="pointer">
              <ArrowBackIcon h={8} w={8} m={0} />
              <Box ml={2} textDecoration="none">
                戻る
              </Box>
            </Flex>
          </Link>

          <Wrap>
            <Button colorScheme="red" onClick={onClickDelete}>
              削除
            </Button>

            {open ? (
              <PrimaryButton onClick={onClickSave} isLoading={saving}>
                公開する
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={onClickSave} isLoading={saving}>
                下書きを保存
              </PrimaryButton>
            )}

            {open ? (
              <HStack>
                <Box color="gray" overflowWrap="unset">
                  非公開
                </Box>
                <Switch size="lg" onChange={onClickOpen} isChecked={open} />
                <Box color="red" fontWeight="bold">
                  公開
                </Box>
              </HStack>
            ) : (
              <HStack>
                <Box color="blue" fontWeight="bold">
                  非公開
                </Box>
                <Switch size="lg" onChange={onClickOpen} isChecked={open} />
                <Box color="gray">公開</Box>
              </HStack>
            )}
          </Wrap>
        </Flex>

        <Box mt={5} display={{ md: "none" }}>
          ＊編集作業はPC推奨です＊
        </Box>
        <Heading fontSize={20} mt={5} mb={3}>
          タイトル
        </Heading>
        <Input
          placeholder="作品のタイトル"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          w="90%"
        />

        <Heading fontSize={20} mt={5} mb={3}>
          タグ(5個まで)
        </Heading>
        <Box width="90%">
          <TagInput tags={tags} setTags={setTags} />
        </Box>
        <Heading fontSize={20} my="2em">
          作品の紹介文
        </Heading>
        <Box w="90%" mb="1em">
          <MarkdownEditor
            markdown={markdown}
            setMarkdown={setMarkdown}
            productId={query}
          />
        </Box>
      </Flex>
    </>
  );
};

export default Edit;
