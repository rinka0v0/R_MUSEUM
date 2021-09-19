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

const ProductPage: React.VFC = () => {
  const router = useRouter();
  const query = router.asPath.split("/")[2];

  const [product, setProduct] =
    useState<firebase.firestore.DocumentData | undefined>();

  const [commentMarkdown, setCommentMarkdown] = useState("");
  const [error, setError] = useState(false);
  const [isliked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { commentsData, isError, isLoading } = useCommentFetch(query);
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
      setProduct({ data: { content: "投稿が見つかりませんでした🙇‍♂️" } });
    } else {
      const productData = fetchedProduct.data();
      const fetchedUser = await db
        .collection("users")
        .doc(productData?.userId)
        .get();
      const user = fetchedUser.data();

      const tagNames: Array<string> = [];
      if (productData?.tagsIDs.length) {
        //タグずけされている場合はクライアントサイドジョインする
        await Promise.all(
          productData?.tagsIDs.map(async (tagId: string) => {
            const fetchedTag = await db.collection("tags").doc(tagId).get();
            const tagData = fetchedTag.data();
            tagNames.push(tagData?.name);
          })
        );
      }

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
        tags: tagNames,
      });
    }
  };

  const onClickLiked = async (isliked: boolean) => {
    if (loading) {
      return;
    }
    setLoading(true);
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
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
    fetchIsLiked();
  }, []);

  return (
    <Box>
      <Header />
      <Flex alignItems="center" flexDirection="column">
        {currentUser?.uid === product?.data.userId ? (
          <Box position="absolute" right="30px" top="100px">
            <PrimaryButton onClick={onClickEdit}>編集</PrimaryButton>
          </Box>
        ) : null}
        <Link href={`/${product?.userId}`}>
          <Flex
            alignItems="center"
            my={5}
            ml="1em"
            mr="auto"
            mt="40px"
            cursor="pointer"
          >
            <>
              <Avatar src={product?.user?.iconURL} mr={3} ml={3} />
              <Box>{product?.user?.user_name}</Box>
            </>
          </Flex>
        </Link>

        <Box
          onClick={() =>
            currentUser
              ? onClickLiked(isliked)
              : showMessage({ title: "ログインしてください", status: "error" })
          }
          cursor="pointer"
          mr="30px"
          ml="auto"
        >
          <IconContext.Provider
            value={{ color: isliked ? "red" : "gray", size: "3em" }}
          >
            <AiFillHeart />
          </IconContext.Provider>
        </Box>

        <Heading my={5}>{product?.data.title}</Heading>
        <Heading my={5}>{product?.title}</Heading>
        <Box>
          {product?.tags
            ? product?.tags.map((tag: string,index:number) => {
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
          <Box w="80%" m="0 auto">
            {isLoading ? <Box>Loading...</Box> : null}
            {isError ? <Box>コメントを読み込めませんでした🙇‍♂️</Box> : null}
            {commentsData && commentsData.length
              ? commentsData.map((comment, index) => {
                  return (
                    <Box key={index} mb={4}>
                      <Comment
                        userId={comment.userId}
                        content={comment.content}
                        likes={comment.likes}
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
    </Box>
  );
};

export default ProductPage;
