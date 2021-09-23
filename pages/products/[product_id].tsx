import React, { useContext, useState } from "react";
import Link from "next/link";
import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import Header from "../../components/layout/Header";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { useEffect } from "react";
import firebase from "firebase";
import DOMPurify from "dompurify";
import marked from "marked";
import { AuthContext } from "../../auth/AuthProvider";
import PrimaryButton from "../../components/atoms/button/PrimaryButton";
import CommentEditor from "../../components/editor/CommentEditor";
import Comment from "../../components/card/Comment";
import moment from "moment";
import useCommentFetch from "../../hooks/useFetchComment";
import { AiFillHeart } from "react-icons/ai";
import { IconContext } from "react-icons/lib";
import "github-markdown-css";
import useMessage from "../../hooks/useMessage";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

const ProductPage: React.VFC = () => {
  const router = useRouter();
  const query = router.asPath.split("/")[2];

  const [product, setProduct] =
    useState<firebase.firestore.DocumentData | undefined>();

  const [commentMarkdown, setCommentMarkdown] = useState("");
  const [isliked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useContext(AuthContext);
  const { commentsData, isError } = useCommentFetch(query);
  const { showMessage } = useMessage();

  const onClickEdit = () => {
    router.push(`/products/${product?.id}/edit`);
  };

  const fetchIsLiked = async () => {
    const isLikedDoc = await db
      .collection("users")
      .doc(currentUser?.uid)
      .collection("likedPosts")
      .doc(product?.id)
      .get();
    setIsLiked(isLikedDoc.exists);
  };

  const fetchProduct = async () => {
    const fetchedProduct = await db.collection("products").doc(query).get();
    if (!fetchedProduct.exists) {
      showMessage({ title: "投稿が見つかりませんでした🙇‍♂️", status: "error" });
      await router.push("/");
    } else {
      const productData = fetchedProduct.data();
      const fetchedUser = await db
        .collection("users")
        .doc(productData?.userId)
        .get();
      const user = fetchedUser.data();

      const isLikedDoc = await db
        .collection("users")
        .doc(currentUser?.uid)
        .collection("likedPosts")
        .doc(fetchedProduct?.id)
        .get();

      setIsLiked(isLikedDoc.exists);

      setProduct({
        data: productData,
        id: fetchedProduct?.id,
        user,
        userId: productData?.userId,
      });
    }
  };

  const onClickLiked = async (isliked: boolean) => {
    if (loading) {
      return;
    }
    const productRef = db.collection("products").doc(product?.id);
    const currentUserRef = db.collection("users").doc(currentUser?.uid);
    if (isliked) {
      const batch = db.batch();
      batch.delete(
        db.doc(productRef.path).collection("likedUsers").doc(currentUserRef.id)
      );
      batch.delete(
        db.doc(currentUserRef.path).collection("likedPosts").doc(productRef.id)
      );

      batch.update(productRef, {
        likeCount: firebase.firestore.FieldValue.increment(-1),
      });

      await batch.commit();
      setIsLiked(false);
    } else {
      const batch = db.batch();
      batch.set(
        db
          .collection("products")
          .doc(product?.id)
          .collection("likedUsers")
          .doc(currentUser?.uid),
        {
          id: currentUser?.uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }
      );
      batch.set(
        db
          .collection("users")
          .doc(currentUser?.uid)
          .collection("likedPosts")
          .doc(product?.id),
        {
          id: productRef.id,
          postRef: productRef,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }
      );

      batch.update(productRef, {
        likeCount: firebase.firestore.FieldValue.increment(1),
      });

      await batch.commit();
      setIsLiked(true);
    }
  };

  useEffect(() => {
    Promise.all([fetchProduct(), fetchIsLiked()])
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        showMessage({ title: "エラーが発生しました", status: "error" });
      });
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <Flex
          FlexShadow="lg"
          justify="center"
          flexDirection="column"
          align="center"
          mb={5}
        >
          <Flex justify="space-between" my={5} w="80%" align="center">
            <SkeletonCircle h="48px" w="48px" />
            <Skeleton h="48px" w="48px" />
          </Flex>
          <Skeleton height="43px" width="80%" my={5} mb="60px" />
          <SkeletonText mt="4" noOfLines={30} spacing="4" w="80%" />
        </Flex>
      </>
    );
  }

  return (
    <>
      <Header />
      <Flex flexDirection="column" align="center">
        <Flex align="center" my={5} justify="space-between" width="80%">
          <Link href={`/${product?.userId}`}>
            <Flex alignItems="center" cursor="pointer">
              <>
                <Avatar src={product?.user?.iconURL} mr={3} ml={3} />
                <Box>{product?.user?.user_name}</Box>
              </>
            </Flex>
          </Link>

          <Flex align="center" justify="space-around">
            {currentUser?.uid === product?.data.userId ? (
              <Box>
                <PrimaryButton onClick={onClickEdit}>編集</PrimaryButton>
              </Box>
            ) : null}

            <Box
              onClick={() =>
                currentUser
                  ? onClickLiked(isliked)
                  : showMessage({
                      title: "ログインしてください",
                      status: "error",
                    })
              }
              cursor="pointer"
            >
              <IconContext.Provider
                value={{ color: isliked ? "red" : "gray", size: "3em" }}
              >
                <AiFillHeart />
              </IconContext.Provider>
            </Box>
          </Flex>
        </Flex>

        <Heading my={5} maxW="80%">
          {product?.data.title}
        </Heading>

        {product?.data?.updatedAt !== "" ? (
          <Box>
            更新:{" "}
            {moment(product?.data.updatedAt.toDate().toString()).fromNow()}
          </Box>
        ) : null}

        <Box maxW="80%">
          {product?.data?.tagsIDs?.length
            ? product?.data?.tagsIDs.map((tag: string, index: number) => {
                return (
                  <Link key={index} href={`/tags/${tag}`}>
                    <Box
                      display="inline-block"
                      m=".6em"
                      p=".6em"
                      lineHeight="1"
                      textDecoration="none"
                      color="#00e"
                      backgroundColor="#fff"
                      border="1px solid #00e"
                      borderRadius="2em"
                      cursor="pointer"
                    >
                      {tag}
                    </Box>
                  </Link>
                );
              })
            : null}
        </Box>

        <Box
          bg="white"
          minH="300px"
          className="markdown-body"
          p={5}
          w="80%"
          my={5}
        >
          <Box
            boxSizing="border-box"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                marked(product ? product.data.content : "Loading...")
              ),
            }}
          ></Box>
        </Box>
        <Box bg="white" H="100px" p={5} w="80%" mb={5}>
          <Heading fontSize="20px" textAlign="center" my="2em">
            コメント
          </Heading>
          <Box w="100%" m="0 auto">
            {isError ? <Box>コメントを読み込めませんでした🙇‍♂️</Box> : null}
            {commentsData && commentsData.length
              ? commentsData.map((comment, index) => {
                  return (
                    <Box key={index} mb={4}>
                      <Comment
                        commentId={comment.id}
                        productId={query}
                        userId={comment.userId}
                        content={comment.content}
                        createdAt={moment(comment.createdAt).fromNow()}
                      />
                    </Box>
                  );
                })
              : null}
          </Box>
          <CommentEditor
            markdown={commentMarkdown}
            setMarkdown={setCommentMarkdown}
            productId={query}
          />
        </Box>
      </Flex>
    </>
  );
};

export default ProductPage;
