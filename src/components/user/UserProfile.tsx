import { Avatar, Box, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { VFC } from "react";
import {
  AiFillGithub,
  AiFillInstagram,
  AiFillTwitterCircle,
} from "react-icons/ai";
import firebase from "firebase";

type Props = {
  user: firebase.firestore.DocumentData | undefined;
};

const UserProfile: VFC<Props> = ({ user }) => {
  return (
    <Flex
      w={{ md: "90%", base: "100%" }}
      alignItems="center"
      my={10}
      justify="space-around"
      flexDirection={{ base: "column", md: "row" }}
    >
      <Box mb={5}>
        <Avatar
          src={user?.iconURL ? user.iconURL : "https://bit.ly/broken-link"}
          size="2xl"
          w="100%"
          display="block"
        />
        {/* <Button>アイコンの変更</Button> */}
      </Box>
      <Box w={{ md: "70%", base: "90%" }}>
        <Flex align="center">
          <Box fontSize={{ base: "1.5em", md: "2em" }} fontWeight="bold">
            {user?.user_name}
          </Box>
          {user?.twitter ? (
            <Box mx={1} cursor="pointer">
              <Link href={`http://twitter.com/${user.twitter}`}>
                <AiFillTwitterCircle size="2em" />
              </Link>
            </Box>
          ) : null}
          {user?.gitHub ? (
            <Box mx={1} cursor="pointer">
              <Link href={`https://gitHub.com/${user.gitHub}`}>
                <AiFillGithub size="2em" />
              </Link>
            </Box>
          ) : null}
          {user?.instagram ? (
            <Box mx={1} cursor="pointer">
              <Link href={`https://instagram.com/${user.instagram}`}>
                <AiFillInstagram size="2em" />
              </Link>
            </Box>
          ) : null}
        </Flex>
        <Box as="p" fontSize={{ base: ".95em", md: "16px" }}>
          {user?.profile}
        </Box>
      </Box>
    </Flex>
  );
};

export default UserProfile;
