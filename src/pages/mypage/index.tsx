import { useState } from "react";
import Link from "next/link";
import { Box, Flex } from "@chakra-ui/layout";
import Router from "next/router";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import PrimaryButton from "../../components/atoms/button/PrimaryButton";
import Loading from "../../components/layout/Loading";
import { db } from "../../firebase";
import firebase from "firebase";
import useMessage from "../../hooks/useMessage";
import Layout from "../../components/layout/Layout";
import SkeletonList from "../../components/skeleton/SkeletonList";
import ProductList from "../../components/List/ProductList";
import UserProfile from "../../components/user/UserProfile";
import useFetchUserProduct from "../../hooks/useFetchUserProduct";
import useFetchLikedProduct from "../../hooks/useFetchLikedProduct";

type User = {
  data: firebase.firestore.DocumentData | undefined;
};

const Mypage: React.VFC = () => {
  const { currentUser, signInCheck } = useContext(AuthContext);
  const { showMessage } = useMessage();

  const [mode, setMode] = useState("products");
  const [user, setUser] = useState<User | undefined>();

  const perPage = 10;

  const {
    userProducts,
    loading: userLoading,
    fetching: fetchingUser,
    nextDoc: nextUserDoc,
    fetchMoreProducts: fetchMoreUserProduct,
  } = useFetchUserProduct(perPage, String(currentUser?.uid));

  const {
    likedProducts,
    loading: likedLoadig,
    fetching: fetchingLiked,
    fetchMoreProducts: fetchMoreLikedProduct,

    nextDoc: nextLikedDoc,
  } = useFetchLikedProduct(perPage, String(currentUser?.uid));

  const fetchUser = async () => {
    const userRef = await db.collection("users").doc(currentUser?.uid).get();
    const userData = userRef.data();

    setUser({
      data: userData,
    });
  };

  useEffect(() => {
    !currentUser && Router.push("/");
    fetchUser().catch(() => {
      showMessage({ title: "エラーが発生しました", status: "error" });
    });
  }, [currentUser]);

  if (!signInCheck || !currentUser) {
    return <Loading />;
  }

  if (userLoading || likedLoadig) {
    return (
      <Layout>
        <Box ml="auto" mr={5} mt={5}>
          <Link href="/mypage/edit">
            <PrimaryButton>プロフィール編集</PrimaryButton>
          </Link>
        </Box>

        <UserProfile user={user?.data} />

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
        <SkeletonList skeletonNumber={10} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box ml="auto" mr={5} mt={5}>
        <Link href="/mypage/edit">
          <PrimaryButton>プロフィール編集</PrimaryButton>
        </Link>
      </Box>

      <UserProfile user={user?.data} />

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

      {mode === "products" ? (
        <ProductList products={userProducts} />
      ) : likedProducts?.length ? (
        <ProductList products={likedProducts} />
      ) : (
        <Box ml="20px">投稿はありません</Box>
      )}

      {mode == "products" ? (
        nextUserDoc ? (
          <PrimaryButton
            onClick={fetchMoreUserProduct}
            isLoading={fetchingUser}
          >
            もっと見る
          </PrimaryButton>
        ) : null
      ) : nextLikedDoc ? (
        <PrimaryButton
          onClick={fetchMoreLikedProduct}
          isLoading={fetchingLiked}
        >
          もっと見る
        </PrimaryButton>
      ) : null}
    </Layout>
  );
};

export default Mypage;
