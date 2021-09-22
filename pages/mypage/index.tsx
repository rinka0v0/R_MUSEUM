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
import { SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import {
  AiFillGithub,
  AiFillInstagram,
  AiFillTwitterCircle,
} from "react-icons/ai";
import useMessage from "../../hooks/useMessage";

type User = {
  userId: string;
  userData: firebase.firestore.DocumentData | undefined;
  products: Array<Products> | undefined;
};

type Products = {
  productId: string;
  title: string;
  likeCount: number;
  createdAt: firebase.firestore.DocumentData;
  authorName: string;
  authorIconURL: string;
};

const Mypage: React.VFC = () => {
  const { currentUser, signInCheck } = useContext(AuthContext);
  const { showMessage } = useMessage();

  const [mode, setMode] = useState("products");
  const [likedProducts, setLikedProducts]: Array<any> = useState([]);
  const [user, setUser] = useState<User | undefined>();
  const [fetching, setFetching] = useState(false);
  const [likedEmpty, setLikedEmpty] = useState(false);
  const [userEmpty, setUserEmpty] = useState(false);
  const [nextLikedDoc, setNextLikedDoc]: any = useState();
  const [nextUserDoc, setNextUserDoc]: any = useState();
  const [loading, setLoading] = useState(true);

  const perPage = 10;

  const fetchUser = async () => {
    const userRef = await db.collection("users").doc(currentUser?.uid).get();
    const userData = userRef.data();
    const productsRef = await db
      .collection("products")
      .where("userId", "==", currentUser?.uid)
      .where("open", "==", true)
      .orderBy("createdAt", "desc")
      .limit(perPage)
      .get();

    const userProducts: Array<Products> = [];
    productsRef.forEach(async (productRef) => {
      const productData = productRef.data();
      userProducts.push({
        productId: productRef.id,
        title: productData.title,
        authorName: userData?.user_name,
        authorIconURL: userData?.iconURL,
        likeCount: productData.likeCount,
        createdAt: productData.createdAt,
      });
    });

    if (productsRef.docs[perPage - 1]) {
      setNextUserDoc(productsRef.docs[perPage - 1]);
      setUserEmpty(false);
    } else {
      setUserEmpty(true);
    }

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
      .orderBy("createdAt", "desc")
      .limit(perPage)
      .get();

    const likedProductsDataArray: Array<any> = [];
    likedProductsDocs.forEach((productRef) => {
      likedProductsDataArray.push({
        ref: productRef.data().postRef,
      });
    });

    await Promise.all(
      likedProductsDataArray.map(async (productRef, index: number) => {
        const productDoc = await productRef.ref.get();
        if (productDoc.exists) {
          const productData = productDoc.data();
          const authorDoc = await db
            .collection("users")
            .doc(productDoc.data().userId)
            .get();
          const authorData = authorDoc.data();

          likedProductsDataArray[index] = {
            productId: productRef.ref.id,
            authorName: authorData?.user_name,
            authorIconURL: authorData?.iconURL,
            title: productData.title,
            likeCount: productData.likeCount,
            createdAt: productData.createdAt,
          };
        }
        return;
      })
    ).catch(() => {
      showMessage({ title: "エラーが発生しました", status: "error" });
    });
    setLikedProducts(likedProductsDataArray);
    if (likedProductsDocs.docs[perPage - 1]) {
      setNextLikedDoc(likedProductsDocs.docs[perPage - 1]);
      setLikedEmpty(false);
    } else {
      setLikedEmpty(true);
    }
  };

  const getNextLikedSnapshot = async (start: any, perPage: number) => {
    setFetching(true);

    const likedProductsDocs = await db
      .collection("users")
      .doc(currentUser?.uid)
      .collection("likedPosts")
      .orderBy("createdAt", "desc")
      .startAfter(start)
      .limit(perPage)
      .get();

    const likedProductsDataArray: Array<any> = [];
    likedProductsDocs.forEach((productRef) => {
      likedProductsDataArray.push({
        ref: productRef.data().postRef,
      });
    });

    await Promise.all(
      likedProductsDataArray.map(async (productRef, index: number) => {
        const productDoc = await productRef.ref.get();
        const productData = productDoc.data();
        const authorDoc = await db
          .collection("users")
          .doc(productDoc.data().userId)
          .get();
        const authorData = authorDoc.data();

        likedProductsDataArray[index] = {
          productId: productRef.ref.id,
          authorName: authorData?.user_name,
          authorIconURL: authorData?.iconURL,
          title: productData.title,
          likeCount: productData.likeCount,
          createdAt: productData.createdAt,
        };
        return;
      })
    );

    setLikedProducts((prev: any) => [...prev, ...likedProductsDataArray]);
    if (likedProductsDocs.docs[perPage - 1]) {
      setNextLikedDoc(likedProductsDocs.docs[perPage - 1]);
      setLikedEmpty(false);
    } else {
      setLikedEmpty(true);
    }
    setFetching(false);
  };

  const getNextUserSnapshot = async (start: any, perPage: number) => {
    setFetching(true);

    const productsRef = await db
      .collection("products")
      .where("userId", "==", currentUser?.uid)
      .orderBy("createdAt", "desc")
      .startAfter(start)
      .limit(perPage)
      .get();

    const userProductsDataArray: Array<any> = [];
    productsRef.forEach((productRef) => {
      const productData = productRef.data();
      userProductsDataArray.push({
        productId: productRef.id,
        title: productData.title,
        likes: productData.likeCount,
        createdAt: productData.createdAt,
        authorId: productData.userId,
      });
    });

    await Promise.all(
      userProductsDataArray.map(async (productData, index: number) => {
        const authorDoc = await db
          .collection("users")
          .doc(productData.authorId)
          .get();

        const authorData = authorDoc.data();
        userProductsDataArray[index] = {
          ...productData,
          authorName: authorData?.user_name,
          authorIconURL: authorData?.iconURL,
        };
        return;
      })
    );

    setUser((prev: any) => {
      return {
        ...prev,
        products: [...prev?.products, ...userProductsDataArray],
      };
    });

    if (productsRef.docs[perPage - 1]) {
      setNextUserDoc(productsRef.docs[perPage - 1]);
      setUserEmpty(false);
    } else {
      setUserEmpty(true);
    }
    setFetching(false);
  };

  useEffect(() => {
    !currentUser && Router.push("/");
    Promise.all([fetchUser(), fetchLikedProducts()])
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        showMessage({ title: "エラーが発生しました", status: "error" });
      });
  }, [currentUser]);

  if (!signInCheck || !currentUser) {
    return <Loading />;
  }

  if (loading) {
    return (
      <Box mb={5}>
        <Header />
        <Flex alignItems="center" flexDirection="column">
          <Box ml="auto" mr={5} mt={5}>
            <Link href="/mypage/edit">
              <PrimaryButton>プロフィール編集</PrimaryButton>
            </Link>
          </Box>
          <Flex
            w={{ md: "90%", base: "100%" }}
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
                maxW="960px"
                w="100%"
                display="block"
              />
              {/* <Button>アイコンの変更</Button> */}
            </Box>
            <Box w={{ md: "70%", base: "90%" }}>
              <Box fontSize={{ base: "1.5em", md: "2em" }} fontWeight="bold">
                {currentUser.displayName}
              </Box>
              <Box as="p" fontSize={{ base: ".95em", md: "16px" }}>
                {user?.userData?.profile}
              </Box>
            </Box>
          </Flex>

          <Flex fontSize="20px">
            <Box
              mx={5}
              cursor="pointer"
              color={mode === "products" ? "inherit" : "gray.400"}
            >
              作品
            </Box>
            <Box
              mx={5}
              cursor="pointer"
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
            _after={{
              content: "''",
              display: "block",
              width: "calc(100% / 2)",
            }}
          >
            {Array(10)
              .fill(0)
              .map((_, index) => {
                return (
                  <Box
                    key={index}
                    m={{ md: "0.5em auto", base: "0.5em auto" }}
                    p="0"
                    w={{ md: " calc(96%/2)", base: "96%" }}
                  >
                    <Box m="0 auto" w="350px" bg="white" p="12px">
                      <SkeletonText spacing="2" />
                      <SkeletonCircle size="10" mt={2} />
                    </Box>
                  </Box>
                );
              })}
          </Flex>
        </Flex>
      </Box>
    );
  }

  return (
    <Box mb={5}>
      <Header />
      <Flex align="center" justify="center" flexDirection="column">
        <Box ml="auto" mr={5} mt={5}>
          <Link href="/mypage/edit">
            <PrimaryButton>プロフィール編集</PrimaryButton>
          </Link>
        </Box>
        <Flex
          w={{ md: "90%", base: "100%" }}
          alignItems="center"
          my={10}
          justify="space-around"
          flexDirection={{ base: "column", md: "row" }}
        >
          <Box mb={5}>
            <Avatar
              src={
                currentUser.photoURL
                  ? currentUser.photoURL
                  : "https://bit.ly/broken-link"
              }
              size="2xl"
              maxW="960px"
              w="100%"
              display="block"
            />
            {/* <Button>アイコンの変更</Button> */}
          </Box>
          <Box w={{ md: "70%", base: "90%" }}>
            <Flex align="center">
              <Box fontSize={{ base: "1.5em", md: "2em" }} fontWeight="bold">
                {currentUser.displayName}
              </Box>
              {user?.userData?.twitter ? (
                <Box mx={1} cursor="pointer">
                  <Link href={`http://twitter.com/${user.userData.twitter}`}>
                    <AiFillTwitterCircle size="2em" />
                  </Link>
                </Box>
              ) : null}
              {user?.userData?.gitHub ? (
                <Box mx={1} cursor="pointer">
                  <Link href={`https://gitHub.com/${user.userData.gitHub}`}>
                    <AiFillGithub size="2em" />
                  </Link>
                </Box>
              ) : null}
              {user?.userData?.instagram ? (
                <Box mx={1} cursor="pointer">
                  <Link
                    href={`https://instagram.com/${user.userData.instagram}`}
                  >
                    <AiFillInstagram size="2em" />
                  </Link>
                </Box>
              ) : null}
            </Flex>
            <Box as="p" fontSize={{ base: ".95em", md: "16px" }}>
              {user?.userData?.profile}
            </Box>
          </Box>
        </Flex>

        <Flex fontSize="20px">
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
          // position="relative"
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
                const date: string = product.createdAt.toDate().toString();
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
                          name: product.title,
                          userName: user.userData?.name,
                          userIcon: user.userData?.iconURL,
                          likes: product.likeCount,
                          createdAt: moment(date).fromNow(),
                        }}
                      />
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box ml="20px" textAlign="center" w="100%">
                投稿はありません
              </Box>
            )
          ) : likedProducts.length ? (
            likedProducts.map((likedProduct: any, index: string) => {
              const createdAtString: string = likedProduct.createdAt
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
                        name: likedProduct.title,
                        userName: likedProduct.authorName,
                        userIcon: likedProduct.authorIconURL,
                        likes: likedProduct.likeCount,
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
        {mode == "products" ? (
          userEmpty ? null : (
            <PrimaryButton
              onClick={() => getNextUserSnapshot(nextUserDoc, perPage)}
              isLoading={fetching}
            >
              もっと見る
            </PrimaryButton>
          )
        ) : likedEmpty ? null : (
          <PrimaryButton
            onClick={() => getNextLikedSnapshot(nextLikedDoc, perPage)}
            isLoading={fetching}
          >
            もっと見る
          </PrimaryButton>
        )}
      </Flex>
    </Box>
  );
};

export default Mypage;
