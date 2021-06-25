import React, { useEffect } from "react";
import TrendLanguage from "../components/card/TrendLanguage";
import Exhibit from "../components/card/Exhibit";
import { Box, Flex, Heading, VStack } from "@chakra-ui/layout";
import Header from "../components/layout/Header";
import { db } from "../firebase";
import firebase from "firebase";
import { useState } from "react";

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

  console.log("レンダリングされました");

  const fetchProducts = async () => {
    console.log("開始");
    const data = await db
      .collection("products")
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
        console.log("map開始");
        await Promise.all(
          fetchedProducts.map(async (product, index) => {
            await db
              .collection("users")
              .doc(product.data.userId)
              .get()
              .then((result) => {
                const user = result.data();
                console.log(JSON.stringify(user), "ユーザー");
                console.log(fetchedProducts[index], "index変更前");

                fetchedProducts[index] = {
                  id: product.id,
                  data: product.data,
                  user,
                };
                console.log(fetchedProducts[index], "index変更後");
              });
            return;
          })
        );
        console.log("map終了");
        console.log(JSON.stringify(fetchedProducts), "中間");

        console.log("終了");
        return fetchedProducts;
      });
    console.log(JSON.stringify(data), "finaly");
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Box>
      <Header />
      <Flex align="center" justify="center" flexDirection="column">
        <VStack w="100%" spacing={8}>
          <Box w="80%" mt={10}>
            <TrendLanguage languages={["TypeScript", "Go", "React"]} />
          </Box>
          <Heading as="h2" textAlign="center">
            作品一覧
          </Heading>
          {products.map((product, index) => {
            return (
              <Exhibit
                key={index}
                exhibit={{
                  id: product.id,
                  name: product.data.title,
                  userName: product.user.user_name,
                  userIcon: product.user.iconURL,
                  likes: 0,
                  createdAt: "10日前",
                }}
              />
            );
          })}
        </VStack>
      </Flex>
    </Box>
  );
};

export default IndexPage;
