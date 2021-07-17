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
import "github-markdown-css";
import { AuthContext } from "../../auth/AuthProvider";
import PrimaryButton from "../../components/atoms/button/PrimaryButton";
import CommentEditor from "../../components/editor/CommentEditor";
import Comment from "../../components/card/Comment";
import moment from "moment";

type CommentData = {
  userId: string;
  content: firebase.firestore.DocumentData;
  createdAt: string;
  likes: number;
};

const ProductPage: React.VFC = () => {
  const router = useRouter();
  const [product, setProduct] =
    useState<firebase.firestore.DocumentData | undefined>();
  const [html, setHTML] = useState("");
  const [commentHTML, setCommentHTML] = useState("");
  const [commentMarkdown, setCommentMarkdown] = useState("");
  const [comments, setComments] = useState<
    Array<firebase.firestore.DocumentData>
  >([]);

  const { currentUser } = useContext(AuthContext);

  const onClickEdit = () => {
    router.push(`/products/${product?.id}/edit`);
  };

  const query = router.asPath.split("/")[2];

  const fetchProduct = async () => {
    db.collection("products")
      .doc(query)
      .get()
      .then(async (product) => {
        const data = await product.data();
        const html = DOMPurify.sanitize(marked(data?.content));
        setHTML(html);
        await db
          .collection("users")
          .doc(data?.userId)
          .get()
          .then(async (userdoc) => {
            const user = await userdoc.data();
            setProduct({ data, id: product.id, user });
          });
      });
  };

  const fetchComments = () => {
    const fetchedComments: Array<CommentData> = [];
    db.collection("products")
      .doc(query)
      .collection("comments")
      .get()
      .then((comments) => {
        comments.forEach((comment) => {
          fetchedComments.push({
            content: comment.data().content,
            likes: comment.data().likes,
            createdAt: comment.data().createdAt,
            userId: comment.data().userId,
          });
          setComments(fetchedComments);
        });
      });
  };

  useEffect(() => {
    fetchProduct();
    fetchComments();
    console.log(comments);
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
        <Heading my={5}>{product?.data.title}</Heading>
        <Flex alignItems="center" my={5}>
          <Avatar src={product?.user.iconURL} mr={3} ml={3} />
          <Box>{product?.user.user_name}</Box>
        </Flex>
        <Heading my={5}>{product?.title}</Heading>
        <Heading fontSize={20}>使用技術</Heading>
        <Box>
          {product?.data.tagsIDs.map((tag: string) => {
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
          <Heading fontSize="20px">コメント</Heading>
          {comments.length
            ? comments.map((comment, index) => {
                const date: string = comment.createdAt.toDate().toString();
                return (
                  <Comment
                    key={index}
                    userId={comment.userId}
                    content={comment.content}
                    likes={comment.likes}
                    createdAt={moment(date).fromNow()}
                  />
                );
              })
            : null}

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
