import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import { SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { AuthContext } from "../auth/AuthProvider";
import PrimaryButton from "../components/atoms/button/PrimaryButton";
import Exhibit from "../components/card/Exhibit";
import Header from "../components/layout/Header";
import { db } from "../firebase";

const ProductPage: React.VFC = () => {
  console.log("/[user_Id]がレンダリング");

  const router = useRouter();
  const userId = router.query.user_id;
  const { currentUser } = useContext(AuthContext);

  //   if (currentUser?.uid === userId) {
  //   router.push(`/mypage`);
  // }

  const perPage = 10;

  const [userInfo, setUserInfo]: any = useState();
  const [nextDoc, setNextDoc]: any = useState();
  const [fetching, setFetching] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchUserInfo = async (userId: any) => {
    const userRef = await db.collection("users").doc(userId).get();
    const productsRef = await db
      .collection("products")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(perPage)
      .get();
    const userProducts: Array<any> = [];
    productsRef.forEach(async (productRef) => {
      const productData = productRef.data();
      userProducts.push({
        productId: productRef.id,
        title: productData.title,
        likes: productData.likeCount,
        createdAt: productData.createdAt,
        authorId: productData.userId,
      });
    });
    setUserInfo({
      userId: userRef.id,
      userData: userRef.data(),
      products: userProducts,
    });
    if (productsRef.docs[perPage - 1]) {
      setNextDoc(productsRef.docs[perPage - 1]);
    } else {
      setEmpty(true);
    }

    setFetching(false);
  };

  const getNextProducts = async (start: any, perPage: number) => {
    setBtnLoading(true);
    const newProductsDocs = await db
      .collection("products")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .startAfter(start)
      .limit(perPage)
      .get();

    const newProductDataArray: Array<any> = [];
    newProductsDocs.forEach((productRef) => {
      const productData = productRef.data();
      newProductDataArray.push({
        productId: productRef.id,
        title: productData.title,
        likes: productData.likeCount,
        createdAt: productData.createdAt,
        authorId: productData.userId,
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

    setBtnLoading(false);
  };

  useEffect(() => {
    fetchUserInfo(userId);
  }, []);

  return (
    <>
      <Header />
      <Flex alignItems="center" flexDirection="column" maxH="1000px" mb={5}>
        <Flex
          w={{ md: "90%" }}
          alignItems="center"
          my={10}
          justify="space-around"
          flexDirection={{ base: "column", md: "row" }}
        >
          <Avatar
            src={userInfo?.userData.iconURL}
            size="2xl"
            mr={3}
            ml={3}
            mt={5}
          />
          <Box width="70%">
            <Box fontSize={30}>{userInfo?.userData.user_name}</Box>
            <Box as="p" fontSize={{ base: ".95em", md: "16px" }}>
              {userInfo?.userData.profile}
            </Box>
          </Box>
        </Flex>
        <Heading fontSize={24} textAlign="center">
          作品一覧
        </Heading>

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
          {fetching
            ? Array(10)
                .fill(0)
                .map((i, index) => {
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
                })
            : userInfo?.products.map((product: any, index: number) => {
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
                          userName: userInfo.userData.user_name,
                          userIcon: userInfo.userData.iconURL,
                          likes: product.likeCount,
                          createdAt: moment(date).fromNow(),
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
        </Flex>
        {empty ? null : (
          <PrimaryButton
            onClick={() => getNextProducts(nextDoc, perPage)}
            isLoading={btnLoading}
          >
            もっと見る
          </PrimaryButton>
        )}
      </Flex>
    </>
  );
};

export default ProductPage;
