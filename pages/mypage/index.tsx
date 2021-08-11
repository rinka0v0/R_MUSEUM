import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import Router from "next/router";
import Link from "next/link";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import PrimaryButton from "../../components/atoms/button/PrimaryButton";
import Loading from "../../components/layout/Loading";
import Header from "../../components/layout/Header";
import { useState } from "react";
import { db } from "../../firebase";
import Exhibit from "../../components/card/Exhibit";
import moment from "moment";

type User = {
  name: string;
  iconURL: string;
  profile: string;
  products?: Array<any>;
};

const Mypage: React.VFC = () => {
  const { currentUser, signInCheck } = useContext(AuthContext);
  console.log(currentUser?.uid);
  const [user, setUser] = useState<User | undefined>({
    name: "",
    iconURL: "",
    profile: "",
    products: [],
  });

  const fetchUser = async () => {
    await db
      .collection("users")
      .doc(currentUser?.uid)
      .get()
      .then(async (userData) => {
        const user = await userData.data();
        return user;
      })
      .then(async (user) => {
        await db
          .collection("products")
          .where("userId", "==", currentUser?.uid)
          .get()
          .then((products) => {
            const productsList: Array<any> = [];
            products.forEach((doc) => {
              const data = { id: doc.id, data: doc.data() };
              productsList.push(data);
            });
            const userObject = {
              name: user?.user_name,
              iconURL: user?.iconURL,
              profile: user?.profile,
              products: productsList,
            };
            setUser(userObject);
          });
      });
  };

  useEffect(() => {
    !currentUser && Router.push("/");
    fetchUser();
    console.log(user, "useEffect");
  }, [currentUser]);

  if (!signInCheck || !currentUser) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <Flex alignItems="center" flexDirection="column" maxH="1000px">
        <Box ml="auto" mr={5} mt={5}>
          <Link href="/mypage/edit">
            <PrimaryButton>プロフィール編集</PrimaryButton>
          </Link>
        </Box>
        <Flex
          w={{ md: "90%" }}
          alignItems="center"
          my={10}
          justify="space-around"
          flexDirection={{ base: "column", md: "row" }}
        >
          <Box>
            <Avatar
              src={
                currentUser.photoURL
                  ? currentUser.photoURL
                  : "https://bit.ly/broken-link"
              }
              size="2xl"
              mx={3}
              my={5}
              display="block"
            />
            {/* <Button>アイコンの変更</Button> */}
          </Box>
          <Box width="70%">
            <Box fontSize={{ base: "1.5em", md: "2em" }} fontWeight="bold">
              {currentUser.displayName}
            </Box>
            <Box as="p" fontSize={{ base: ".95em", md: "16px" }}>
              {user?.profile}
            </Box>
          </Box>
        </Flex>
        <Heading fontSize={24} textAlign="center">
          {currentUser.displayName}さんの作品
        </Heading>
        <Flex
          position="relative"
          m="2em 0"
          maxW="960px"
          w="100%"
          flexWrap="wrap"
          justify="space-between"
          _after={{ content: "''", display: "block", width: "calc(100% / 2)" }}
        >
          {user?.products ? (
            user?.products.map((product, index) => {
              const date: string = product.data.createdAt.toDate().toString();
              return (
                <Box
                  key={index}
                  m={{ md: "0.5em auto", base: "0.5em auto" }}
                  p="0"
                  w={{ md: " calc(96%/2)", base: "96%" }}
                >
                  <Box m="0 auto" w="350px">
                    <Exhibit
                      key={index}
                      exhibit={{
                        id: product.id,
                        name: product.data.title,
                        userName: user.name,
                        userIcon: user.iconURL,
                        likes: 0,
                        createdAt: moment(date).fromNow(),
                      }}
                    />
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box>まだ投稿はありません</Box>
          )}
        </Flex>
      </Flex>
      <></>
    </>
  );
};

export default Mypage;
