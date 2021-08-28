import React, { useContext, useState } from "react";
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
import Link from "next/link";

const ProductPage: React.VFC = () => {
  const router = useRouter();
  const query = router.asPath.split("/")[2];

  const [product, setProduct] =
    useState<firebase.firestore.DocumentData | undefined>();
  const [html, setHTML] = useState("");
  const [commentHTML, setCommentHTML] = useState("");
  const [commentMarkdown, setCommentMarkdown] = useState("");
  const [error, setError] = useState(false);
  const [isliked, setIsLiked] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { commentsData, isError, isLoading } = useCommentFetch(query);

  const onClickEdit = () => {
    router.push(`/products/${product?.id}/edit`);
  };

  const fetchProduct = async () => {
    const fetchedProduct = await db.collection("products").doc(query).get();
    if (!fetchedProduct.exists) {
      const html = DOMPurify.sanitize(marked("投稿がみつかりませんでした"));
      setHTML(html);
    } else {
      const productData = await fetchedProduct.data();
      const html = DOMPurify.sanitize(marked(productData?.content));
      setHTML(html);
      const fetchedUser = await db
        .collection("users")
        .doc(productData?.userId)
        .get();
      const user = await fetchedUser.data();

      const tagNames: Array<string> = [];
      if (productData?.tagsIDs.length) {
        //タグずけされている場合はクライアントサイドジョインする
        await Promise.all(
          productData?.tagsIDs.map(async (tagId: string) => {
            const fetchedTag = await db.collection("tags").doc(tagId).get();
            const tagData = await fetchedTag.data();
            tagNames.push(tagData?.name);
          })
        );
      }

      setProduct({
        data: productData,
        id: fetchedProduct?.id,
        user,
        userId: fetchedUser.id,
        tags: tagNames,
      });
    }
  };

  const onClickLiked = async (isliked: boolean) => {
    const postRef = db.collection("products").doc(product?.id);
    const currentUserRef = db.collection("users").doc(currentUser?.uid);
    if (isliked) {
      const batch = db.batch();
      batch.delete(
        db.doc(postRef.path).collection("likedUsers").doc(currentUserRef.id)
      );
      batch.delete(
        db.doc(currentUserRef.path).collection("likedPosts").doc(postRef.id)
      );
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
          id: postRef.id,
          postRef,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }
      );
      await batch.commit();
      setIsLiked(true);
    }
  };

  useEffect(() => {
    fetchProduct();
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
        <Flex
          alignItems="center"
          my={5}
          ml="1em"
          mr="auto"
          mt="40px"
          cursor="pointer"
        >
          <Link href={`/${product?.userId}`}>
            <>
              <Avatar src={product?.user.iconURL} mr={3} ml={3} />
              <Box>{product?.user.user_name}</Box>
            </>
          </Link>
        </Flex>
        <Box onClick={() => onClickLiked(isliked)} cursor="pointer">
          {isliked ? "unlike" : "lilke"}
        </Box>

        <Heading my={5}>{product?.data.title}</Heading>
        <Heading my={5}>{product?.title}</Heading>
        <Box>
          {product?.tags.map((tag: string) => {
            return (
              <Box
                key={tag}
                display="inline-block"
                m=".6em"
                p=".6em"
                lineHeight="1"
                textDecoration="none"
                color="#00e"
                backgroundColor="#fff"
                border="1px solid #00e"
                borderRadius="2em"
              >
                {tag}
              </Box>
            );
          })}
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
              __html: html,
            }}
          ></Box>
        </Box>
        <Box bg="white" H="100px" p={5} w="80%">
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
            HTML={commentHTML}
            setMarkdown={setCommentMarkdown}
            setHTML={setCommentHTML}
            productId={query}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default ProductPage;
