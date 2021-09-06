import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { AuthContext } from "../auth/AuthProvider";
import Exhibit from "../components/card/Exhibit";
import Header from "../components/layout/Header";
import { db } from "../firebase";

const ProductPage: React.VFC = () => {
  const { currentUser } = useContext(AuthContext);

  const [userInfo, setUserInfo]: any = useState();

  const router = useRouter();
  const userId = router.query.user_id;

  const fetchUserInfo = async (userId: any) => {
    const userRef = await db.collection("users").doc(userId).get();
    const productsRef = await db
      .collection("products")
      .where("userId", "==", userId)
      .get();
    const userProducts: Array<any> = [];
    productsRef.forEach(async (productRef) => {
      userProducts.push({
        productId: productRef.id,
        productData: productRef.data(),
      });
    });
    setUserInfo({
      userId: userRef.id,
      userData: userRef.data(),
      products: userProducts,
    });
  };

  useEffect(() => {
    // if (currentUser?.uid === userId) {
    //   router.push(`/mypage`);
    // }
    fetchUserInfo(userId);
  }, []);

  return (
    <>
      <Header />
      <Flex alignItems="center" flexDirection="column" maxH="1000px">
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
          rinkaさんの作品
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
          {userInfo?.products.map((product: any, index: number) => {
            const productData = product.productData;
            const date: string = productData.createdAt.toDate().toString();
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
                      id: productData.productId,
                      name: productData.title,
                      userName: userInfo.userData.user_name,
                      userIcon: userInfo.userData.iconURL,
                      likes: productData.likeCount,
                      createdAt: moment(date).fromNow(),
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Flex>
      </Flex>
    </>
  );
};

export default ProductPage;
