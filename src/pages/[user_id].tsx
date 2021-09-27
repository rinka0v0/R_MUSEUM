import {  Heading } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { AuthContext } from "../auth/AuthProvider";
import PrimaryButton from "../components/atoms/button/PrimaryButton";
import ProductList from "../components/List/ProductList";
import SkeletonList from "../components/skeleton/SkeletonList";
import { db } from "../firebase";
import firebase from "firebase";
import Layout from "../components/layout/Layout";
import UserProfile from "../components/user/UserProfile";

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

const ProductPage: React.VFC = () => {
  const router = useRouter();
  const userId = router.query.user_id;
  const { currentUser } = useContext(AuthContext);

  if (currentUser?.uid === userId) {
    router.push(`/mypage`);
  }

  const perPage = 10;

  const [userInfo, setUserInfo] = useState<User>();
  const [nextDoc, setNextDoc]: any = useState();
  const [fetching, setFetching] = useState(false);
  const [empty, setEmpty] = useState(false);

  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async (userId: any) => {
    const userRef = await db.collection("users").doc(userId).get();
    const productsRef = await db
      .collection("products")
      .where("userId", "==", userId)
      .where("open", "==", true)
      .orderBy("createdAt", "desc")
      .limit(perPage)
      .get();
    const userData = userRef.data();
    const userProducts: Array<any> = [];
    productsRef.forEach(async (productRef) => {
      const productData = productRef.data();
      userProducts.push({
        id: productRef.id,
        title: productData.title,
        likeCount: productData.likeCount,
        createdAt: productData.createdAt,
        authorName: userData?.user_name,
        authorIconURL: userData?.iconURL,
      });
    });
    setUserInfo({
      data: userData,
      products: userProducts,
    });
    if (productsRef.docs[perPage - 1]) {
      setNextDoc(productsRef.docs[perPage - 1]);
    } else {
      setEmpty(true);
    }

    setLoading(false);
  };

  const getNextProducts = async (start: any, perPage: number) => {
    setFetching(true);
    const newProductsDocs = await db
      .collection("products")
      .where("userId", "==", userId)
      .where("open", "==", true)
      .orderBy("createdAt", "desc")
      .startAfter(start)
      .limit(perPage)
      .get();

    const newProductDataArray: Array<any> = [];
    newProductsDocs.forEach((productRef) => {
      const productData = productRef.data();
      newProductDataArray.push({
        id: productRef.id,
        title: productData.title,
        likes: productData.likeCount,
        createdAt: productData.createdAt,
        authorName: userInfo?.data?.user_name,
        authorIconURL: userInfo?.data?.iconURL,
      });
    });

    setUserInfo((prev: any) => {
      return {
        ...prev,
        products: [...prev.products, ...newProductDataArray],
      };
    });

    if (newProductsDocs.docs[perPage - 1]) {
      setNextDoc(newProductsDocs.docs[perPage - 1]);
    } else {
      setEmpty(true);
    }

    setFetching(false);
  };

  useEffect(() => {
    fetchUserInfo(userId);
  }, []);

  return (
    <>
      <Layout>
        <UserProfile user={userInfo?.data} />

        <Heading fontSize={24} textAlign="center">
          作品一覧
        </Heading>

        {loading ? (
          <SkeletonList skeletonNumber={10} />
        ) : userInfo?.products?.length ? (
          <ProductList products={userInfo.products} />
        ) : null}

        {empty ? null : (
          <PrimaryButton
            onClick={() => getNextProducts(nextDoc, perPage)}
            isLoading={fetching}
          >
            もっと見る
          </PrimaryButton>
        )}
      </Layout>
    </>
  );
};

export default ProductPage;
