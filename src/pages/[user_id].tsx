import { Heading } from "@chakra-ui/layout";
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
import useFetchUserProduct from "../hooks/useFetchUserProduct";

type User = {
  data: firebase.firestore.DocumentData | undefined;
};

const ProductPage: React.VFC = () => {
  const [userInfo, setUserInfo] = useState<User>();

  const router = useRouter();
  const userId = router.query.user_id;
  const { currentUser } = useContext(AuthContext);
  const perPage = 10;
  if (currentUser?.uid === userId) {
    router.push(`/mypage`);
  }

  const {
    userProducts,
    fetchMoreProducts,
    loading,
    nextDoc: nextUserDoc,
  } = useFetchUserProduct(perPage, String(userId));

  const fetchUserInfo = async (userId: any) => {
    const userRef = await db.collection("users").doc(userId).get();
    setUserInfo({
      data: userRef.data(),
    });
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
        ) : userProducts ? (
          <ProductList products={userProducts} />
        ) : null}

        {nextUserDoc ? (
          <PrimaryButton onClick={fetchMoreProducts} isLoading={loading}>
            もっと見る
          </PrimaryButton>
        ) : null}
      </Layout>
    </>
  );
};

export default ProductPage;
