import React, { useEffect } from "react";
import TrendLanguage from "../components/card/TrendLanguage";
import Exhibit from "../components/card/Exhibit";
import { Box, Flex, Heading, VStack } from "@chakra-ui/layout";
import Header from "../components/layout/Header";
import { db } from "../firebase";
import firebase from "firebase";
import { useState } from "react";
import moment from "moment";

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
    const data = await db
      .collection("products")
      // .where("open", "==", true)
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

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Box>
      <Header />
      <Flex align="center" justify="center" flexDirection="column">
        <Box w="80%" mt={10}>
          <TrendLanguage languages={["TypeScript", "Go", "React"]} />
        </Box>
        <Heading as="h2" textAlign="center">
          作品一覧
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
                    likes: 0,
                    createdAt: moment(date).fromNow(),
                  }}
                />
                </Box>
              </Box>
            );
          })}
        </Flex>
      </Flex>
    </Box>
  );
};

export default IndexPage;
