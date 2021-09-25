import firebase from "firebase";
import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex } from "@chakra-ui/layout";
import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react";
import { db } from "../../firebase";
import DOMPurify from "dompurify";
import marked from "marked";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { Button, HStack } from "@chakra-ui/react";
import useMessage from "../../hooks/useMessage";
import useFetchComment from "../../hooks/useFetchComment";

type Props = {
  commentId: string;
  productId: string;
  userId: string;
  createdAt: string;
  content: string;
};

const Comment: React.VFC<Props> = (props) => {
  const [user, setUser] =
    useState<firebase.firestore.DocumentData | undefined>();
  const [deleting, setDeleting] = useState(false);

  const { commentId, productId, userId, createdAt, content } = props;
  const { mutate } = useFetchComment(productId);
  const { currentUser } = useContext(AuthContext);
  const { showMessage } = useMessage();

  const fetchUser = () => {
    db.collection("users")
      .doc(userId)
      .get()
      .then(async (user) => {
        const data = await user.data();
        setUser(data);
        console.log(data);
      });
  };

  const deleteComment = () => {
    if (confirm("コメントを削除しますか？")) {
      setDeleting(true);
      try {
        db.collection("products")
          .doc(productId)
          .collection("comments")
          .doc(commentId)
          .delete();
        showMessage({ title: "削除しました", status: "success" });
      } catch (err) {
        showMessage({ title: "エラーが発生しました", status: "error" });
      }
      mutate();
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <Flex w="100%">
        <Box
          my="1.5em"
          cursor="pointer"
          display={{ base: "none", md: "initial" }}
        >
          <Link href={`/${userId}`}>
            <Avatar src={user?.iconURL} mb={2} />
          </Link>
        </Box>
        <Box w={{ base: "100%", md: "80%" }}>
          <Box
            width="100%"
            display="inline-block"
            position="relative"
            ml={{ md: "2em" }}
            p="17px 13px"
            borderRadius="12px"
            background="#d7ebfe"
            className="markdown-body"
            _after={{
              md: {
                content: '""',
                position: "absolute",
                top: "36px",
                left: "-24px",
                border: "12px solid transparent",
                borderRight: "12px solid #d7ebfe",
              },
            }}
          >
            <Flex
              mb={3}
              align="center"
              flexDirection={{ base: "column", md: "initial" }}
            >
              <HStack align="center">
                <HStack align="center">
                  <Box display={{ md: "none" }}>
                    <Link href={`/${userId}`}>
                      <Avatar src={user?.iconURL} mb={2} size="sm" />
                    </Link>
                  </Box>
                  <Box>{user?.user_name}</Box>
                </HStack>
                <Box>{createdAt}</Box>
              </HStack>
              {currentUser?.uid === userId ? (
                <Button
                  colorScheme="red"
                  onClick={deleteComment}
                  ml="auto"
                  isLoading={deleting}
                >
                  削除
                </Button>
              ) : null}
            </Flex>
            <Box
              boxSizing="border-box"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked(content)),
              }}
            ></Box>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default Comment;
