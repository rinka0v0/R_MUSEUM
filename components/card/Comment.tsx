import firebase from "firebase";
import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex } from "@chakra-ui/layout";
import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react";
import { db } from "../../firebase";
import DOMPurify from "dompurify";
import marked from "marked";

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
    <Box
      bg="white"
      minH="300px"
      className="markdown-body"
      p={5}
      w="100%"
      border="1px solid"
      borderRadius={4}
    >
      <Flex alignItems="center" mb={5}>
        <Box cursor="pointer" mr={4}>
          <Link href={`/${userId}`}>
            <Flex alignItems="center">
              <Avatar src={user?.iconURL} mr={3} ml={3} />
              <Box>{user?.user_name}</Box>
            </Flex>
          </Link>
        </Box>
        {createdAt}
      </Flex>
      <Box
        boxSizing="border-box"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(marked(content)),
        }}
      ></Box>
    </Box>
  );
};

export default Comment;
