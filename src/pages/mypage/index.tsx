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

type User = {
  data: firebase.firestore.DocumentData | undefined;
  products: Array<Products> | undefined;
};

type Products = {
  id: string;
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
        id: productRef.id,
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
      data: userData,
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
            id: productRef.ref.id,
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
          id: productRef.ref.id,
          authorName: authorData?.user_name,
          authorIconURL: authorData?.iconURL,
          title: productData.title,
          likeCount: productData.likeCount,
          createdAt: productData.createdAt,
        };
        return;
      })
    ).catch(() => {
      showMessage({ title: "エラーが発生しました", status: "error" });
    });

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
        id: productRef.id,
        title: productData.title,
        likes: productData.likeCount,
        createdAt: productData.createdAt,
        authorName: user?.data?.user_name,
        authorIconURL: user?.data?.iconURL,
      });
    });

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

      {mode === "products" && user?.products ? (
        <ProductList products={user?.products} />
      ) : likedProducts.length ? (
        <ProductList products={likedProducts} />
      ) : (
        <Box ml="20px">投稿はありません</Box>
      )}

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
    </Layout>
  );
};

export default Mypage;
