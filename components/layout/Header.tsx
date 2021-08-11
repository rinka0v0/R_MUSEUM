import React, { useCallback, useContext, VFC } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { IconButton } from "@chakra-ui/button";
import { SearchIcon } from "@chakra-ui/icons";
import { Box, Flex, Stack } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import PrimaryButton from "../atoms/button/PrimaryButton";
import Link from "next/link";
import { nanoid } from "nanoid";
import {
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/popover";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { db, loginWithGitHub, loginWithGoogle, logout } from "../../firebase";
import { AuthContext } from "../../auth/AuthProvider";
import useMessage from "../../hooks/useMessage";
import firebase from "firebase";

const Header: VFC = () => {
  const { currentUser } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  const pushSignIn = useCallback(() => {
    router.push("/signIn");
  }, []);

  const { showMessage } = useMessage();

  const GoogleLogin = () => {
    try {
      loginWithGoogle();
    } catch (err) {
      showMessage({ title: err.message, status: "error" });
    }
  };
  const GitHubLogin = () => {
    try {
      loginWithGitHub();
    } catch (err) {
      showMessage({ title: err.message, status: "error" });
    }
  };

  const redirectEditPage = (id: string) => {
    db.collection("products")
      .doc(id)
      .set({
        title: " ",
        content: " ",
        userId: currentUser?.uid,
        sorceCode: " ",
        tagsIDs: [],
        open: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        router.push({
          pathname: `/products/${id}/edit`,
        });
      });
  };

  const onClickPost = async () => {
    const id = nanoid();
    const postProductData = async (id: string) => {
      await redirectEditPage(id);
    };
    await postProductData(id);
  };

  return (
    <Flex
      as="nav"
      bg="white"
      align="center"
      justify="space-between"
      height="60px"
    >
      <Box ml={3} fontSize="lg" fontWeight="bold">
        <Link href="/">R_MUSEUM</Link>
      </Box>
      <Flex align="center" mr={3}>
        <NextLink href="/serch">
          <IconButton
            backgroundColor="#ddd"
            aria-label="Search database"
            icon={<SearchIcon />}
            mr={3}
          />
        </NextLink>
        {currentUser ? (
          <>
            <PrimaryButton onClick={onClickPost}>投稿する</PrimaryButton>
            <Popover>
              <PopoverTrigger>
                <Avatar
                  cursor="pointer"
                  src={
                    currentUser.photoURL
                      ? currentUser.photoURL
                      : "https://bit.ly/broken-link"
                  }
                  mx={3}
                />
              </PopoverTrigger>
              <PopoverContent w="150px" mr={5}>
                <PopoverCloseButton />
                <PopoverHeader>Menu</PopoverHeader>
                <PopoverBody p={0}>
                  <Box border="1px solid #ddd" h="30px">
                    <Link href="/mypage">
                      <a
                        style={{
                          height: "100%",
                          width: "100%",
                          display: "block",
                        }}
                      >
                        マイページ
                      </a>
                    </Link>
                  </Box>
                  <Box border="1px solid #ddd" h="30px">
                    <Link href="/dashboard">
                      <a
                        style={{
                          height: "100%",
                          width: "100%",
                          display: "block",
                        }}
                      >
                        {" "}
                        作品の管理
                      </a>
                    </Link>
                  </Box>
                  <Box border="1px solid #ddd" h="30px">
                    <Box onClick={logout} cursor="pointer">
                      サインアウト
                    </Box>
                  </Box>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <>
            <PrimaryButton onClick={onOpen}>ログイン</PrimaryButton>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay>
                <ModalContent>
                  <ModalHeader>ログイン</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody p={5}>
                    <Flex flexDirection="column" alignItems="center">
                      <Stack spacing={5}>
                        <PrimaryButton onClick={GoogleLogin}>
                          Login with Google
                        </PrimaryButton>
                        <PrimaryButton onClick={GitHubLogin}>
                          Login with GitHub
                        </PrimaryButton>
                        <PrimaryButton onClick={pushSignIn}>
                          Login with Email
                        </PrimaryButton>
                      </Stack>
                    </Flex>
                  </ModalBody>
                </ModalContent>
              </ModalOverlay>
            </Modal>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
