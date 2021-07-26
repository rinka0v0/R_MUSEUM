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
import useCommentFetch from "../../hooks/useFetchComment";

const ProductPage: React.VFC = () => {
  const router = useRouter();
  const query = router.asPath.split("/")[2];

  const [product, setProduct] =
    useState<firebase.firestore.DocumentData | undefined>();
  const [html, setHTML] = useState("");
  const [commentHTML, setCommentHTML] = useState("");
  const [commentMarkdown, setCommentMarkdown] = useState("");
  const [error, setError] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { commentsData, isError, isLoading } = useCommentFetch(query);

  const onClickEdit = () => {
    router.push(`/products/${product?.id}/edit`);
  };

  const fetchProduct = async () => {
    db.collection("products")
      .doc(query)
      .get()
      .then(async (product) => {
        if (!product.exists) {
          console.log("データがありません");
          const error = "投稿がみつかりませんでした";
          const html = DOMPurify.sanitize(marked(error));
          setHTML(html);
        } else {
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
        }
      });
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
