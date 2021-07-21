import firebase from "firebase";
import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex } from "@chakra-ui/layout";
import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react";
import { db } from "../../firebase";
import DOMPurify from "dompurify";
import marked from "marked";
import "github-markdown-css";

type Props = {
  userId: string;
  createdAt: string;
  content: string;
  likes: number;
};

const Comment: React.VFC<Props> = (props) => {
  const [user, setUser] =
    useState<firebase.firestore.DocumentData | undefined>();
  const { userId, createdAt, content, likes } = props;
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

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <Flex w="100%" alignItems="center">
        <Box my="1.5em" cursor="pointer">
          <Link href={`/${userId}`}>
            <Avatar src={user?.iconURL} mb={2} />
          </Link>
        </Box>
        <Box w="100%">
          <Box
            width="100%"
            display="inline-block"
            position="relative"
            ml="2em"
            p="17px 13px"
            borderRadius="12px"
            background="#d7ebfe"
            className="markdown-body"
            _after={{
              content: '""',
              position: "absolute",
              top: "36px",
              left: "-24px",
              border: "12px solid transparent",
              borderRight: "12px solid #d7ebfe",
            }}
          >
            <Flex mb={3}>
              <Box mr="2em">{user?.user_name}</Box>
              <Box>{createdAt}</Box>
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
