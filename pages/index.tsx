import React, { useEffect } from "react";
import TrendLanguage from "../components/card/TrendLanguage";
import Exhibit from "../components/card/Exhibit";
import { Box, Flex, Heading, VStack } from "@chakra-ui/layout";
import Header from "../components/layout/Header";
import { db } from "../firebase";
import firebase from "firebase";
import { useState } from "react";
import moment from "moment";
// import { timeStamp } from "console";

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
        <VStack w="100%" spacing={8}>
          <Box w="80%" mt={10}>
            <TrendLanguage languages={["TypeScript", "Go", "React"]} />
          </Box>
          <Heading as="h2" textAlign="center">
            作品一覧
          </Heading>
          {products.map((product, index) => {
            const date: string = product.data.createdAt.toDate().toString();
            return (
              <Exhibit
                key={index}
                exhibit={{
                  id: product.id,
                  name: product.data.title,
                  userName: product.user.user_name,
                  userIcon: product.user.iconURL,
                  likes: 0,
                  createdAt: moment(date).fromNow(),
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
