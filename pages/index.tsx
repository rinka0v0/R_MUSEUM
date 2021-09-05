import React, { useEffect } from "react";
import TrendLanguage from "../components/card/TrendLanguage";
import Exhibit from "../components/card/Exhibit";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import Header from "../components/layout/Header";
import { db } from "../firebase";
import firebase from "firebase";
import { useState } from "react";
import moment from "moment";
import PrimaryButton from "../components/atoms/button/PrimaryButton";
import router from "next/router";

type ProductData = {
  id: string;
  data: firebase.firestore.DocumentData;
  userId?: string;
  user?: firebase.firestore.DocumentData | undefined;
};

const IndexPage: React.VFC = () => {
  const [products, setProducts] = useState<
    Array<firebase.firestore.DocumentData>
  >([]);

  const [popularProducts, setPopularProducts]: Array<any> = useState([]);

  console.log("indexページがレンダリングされました");

  const fetchProducts = async () => {
    const data = await db
      .collection("products")
      .orderBy("createdAt", "desc")
      // .where("open", "==", true)
      .limit(6)
      .get()
      .then((querySnapshot) => {
        const fetchedProducts: Array<ProductData> = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        return fetchedProducts;
      })
      .then(async (fetchedProducts) => {
        await Promise.all(
          fetchedProducts.map(async (product, index) => {
            await db
              .collection("users")
              .doc(product.data.userId)
              .get()
              .then((result) => {
                const user = result.data();
                fetchedProducts[index] = {
                  id: product.id,
                  data: product.data,
                  user,
                };
              });
            return;
          })
        );
        return fetchedProducts;
      });
    setProducts(data);
  };

  const fetchPopularProducts = async () => {
    const productsRef = await db
      .collection("products")
      .where("open", "==", true)
      .orderBy("likeCount")
      .limit(6)
      .get();

    const popularProductsDataArray: Array<any> = [];
    productsRef.forEach((productRef) => {
      const productData = productRef.data();
      popularProductsDataArray.push({
        productId: productRef.id,
        title: productData.title,
        likes: productData.likeCount,
        createdAt: productData.createdAt,
        authorId: productData.userId,
      });
    });

    await Promise.all(
      popularProductsDataArray.map(async (productData, index: number) => {
        const authorDoc = await db
          .collection("users")
          .doc(productData.authorId)
          .get();
        const authorData = authorDoc.data();
        popularProductsDataArray[index] = {
          ...productData,
          authorName: authorData?.user_name,
          authorIconURL: authorData?.iconURL,
        };
        return;
      })
    );
    setPopularProducts(popularProductsDataArray);
  };

  useEffect(() => {
    fetchProducts();
    fetchPopularProducts();
  }, []);

  return (
    <Box mb={5}>
      <Header />
      <Flex align="center" justify="center" flexDirection="column">
        <Box w="80%" mt={10}>
          <TrendLanguage languages={["TypeScript", "Go", "React"]} />
        </Box>
        <Heading as="h2" textAlign="center" mt={5}>
          新しい作品
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
          {products.map((product, index) => {
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
                    exhibit={{
                      id: product.id,
                      name: product.data.title,
                      userName: product.user.user_name,
                      userIcon: product.user.iconURL,
                      likes: product.data.likeCount,
                      createdAt: moment(date).fromNow(),
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Flex>
        <PrimaryButton onClick={() => router.push("/products/latest")}>
          もっと見る
        </PrimaryButton>
        <Heading as="h2" textAlign="center" mt={5}>
          人気の作品（過去1週間）
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
          {popularProducts.map((product: any, index: string) => {
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
                      userName: product.authorName,
                      userIcon: product.authorIconURL,
                      likes: product.likes,
                      createdAt: moment(date).fromNow(),
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Flex>
        <PrimaryButton onClick={() => router.push("/products/popular")} >
          もっと見る
        </PrimaryButton>
      </Flex>
    </Box>
  );
};

export default IndexPage;
