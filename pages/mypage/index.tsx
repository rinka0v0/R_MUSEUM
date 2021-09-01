import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex } from "@chakra-ui/layout";
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
import firebase from "firebase";

type User = {
  userId: string;
  userData: firebase.firestore.DocumentData | undefined;
  products: Array<Products> | undefined;
};

type Products = {
  productId: string;
  productData: firebase.firestore.DocumentData | undefined;
};

const Mypage: React.VFC = () => {
  console.log("マイページがレンダリングされました");

  const { currentUser, signInCheck } = useContext(AuthContext);

  const [mode, setMode] = useState("products");
  const [likedProducts, setLikedProducts]: Array<any> = useState([]);
  const [user, setUser] = useState<User | undefined>();

  const fetchUser = async () => {
    const userRef = await db.collection("users").doc(currentUser?.uid).get();
    const productsRef = await db
      .collection("products")
      .where("userId", "==", currentUser?.uid)
      .get();
    const userProducts: Array<Products> = [];
    await productsRef.forEach(async (productRef) => {
      userProducts.push({
        productId: productRef.id,
        productData: await productRef.data(),
      });
    });
    setUser({
      userId: userRef.id,
      userData: userRef.data(),
      products: userProducts,
    });
  };

  const fetchLikedProducts = async () => {
    const likedProductsDocs = await db
      .collection("users")
      .doc(currentUser?.uid)
      .collection("likedPosts")
      .get();

    const likedProductsDataArray: Array<any> = [];
    await likedProductsDocs.forEach(async (likedProductDoc) => {
      const likedProductRef = await likedProductDoc.data().postRef;
      const productRef = await likedProductRef.get();
      const authorId = productRef.data().userId;
      const authorDoc = await db.collection("users").doc(authorId).get();
      const authorData = await authorDoc.data();
      likedProductsDataArray.push({
        authorName: authorData?.name,
        authorIconURL: authorData?.iconURL,
        authorId,
        productId: productRef.id,
        productData: await productRef.data(),
      });
    });
    setLikedProducts(likedProductsDataArray);
  };

  useEffect(() => {
    !currentUser && Router.push("/");
    fetchUser();
    fetchLikedProducts();
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
              {user?.userData?.name}
            </Box>
          </Box>
        </Flex>

        <Flex fontSize="20px" ml="20%" mr="auto">
          <Box
            mx={5}
            cursor="pointer"
            onClick={() => setMode("products")}
            color={mode === "products" ? "inherit" : "gray.400"}
          >
            作品
          </Box>
          <Box
            mx={5}
            cursor="pointer"
            onClick={() => setMode("likes")}
            color={mode === "likes" ? "inherit" : "gray.400"}
          >
            いいね
          </Box>
        </Flex>
        <Flex
          position="relative"
          m="2em 0"
          maxW="960px"
          w="100%"
          flexWrap="wrap"
          justify="space-between"
          _after={{ content: "''", display: "block", width: "calc(100% / 2)" }}
        >
          {mode === "products" && user?.products ? (
            user?.products.length ? (
              user?.products.map((product, index) => {
                const date: string = product.productData?.createdAt
                  .toDate()
                  .toString();
                return (
                  <Box
                    key={index}
                    m={{ md: "0.5em auto", base: "0.5em auto" }}
                    p="0"
                    w={{ md: " calc(96%/2)", base: "96%" }}
                  >
                    <Box m="0 auto" w="350px">
                      <Exhibit
                        exhibit={{
                          id: product.productId,
                          name: product.productData?.title,
                          userName: user.userData?.name,
                          userIcon: user.userData?.iconURL,
                          likes: product.productData?.likeCount,
                          createdAt: moment(date).fromNow(),
                        }}
                      />
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box ml="20px">投稿はありません</Box>
            )
          ) : likedProducts.length ? (
            likedProducts.map((likedProduct: any, index: string) => {
              const createdAtString: string = likedProduct.productData.createdAt
                .toDate()
                .toString();
              return (
                <Box
                  key={index}
                  m={{ md: "0.5em auto", base: "0.5em auto" }}
                  p="0"
                  w={{ md: " calc(96%/2)", base: "96%" }}
                >
                  <Box m="0 auto" w="350px">
                    <Exhibit
                      exhibit={{
                        id: likedProduct.id,
                        name: likedProduct.productData.title,
                        userName: likedProduct.authorName,
                        userIcon: likedProduct.authorIconURL,
                        likes: likedProduct.productData.likeCount,
                        createdAt: moment(createdAtString).fromNow(),
                      }}
                    />
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box ml="20px">投稿はありません</Box>
          )}
        </Flex>
      </Flex>
      <></>
    </>
  );
};

export default Mypage;
