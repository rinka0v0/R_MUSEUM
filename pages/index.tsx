import React, { useEffect } from "react";
import TrendLanguage from "../components/card/TrendLanguage";
import Exhibit from "../components/card/Exhibit";
import { Box, Flex, Heading, VStack } from "@chakra-ui/layout";
import Header from "../components/layout/Header";
import { db } from "../firebase";
import firebase from "firebase";
import { useState } from "react";

const IndexPage: React.VFC = () => {
  const [products, setProducts] = useState<
    Array<firebase.firestore.DocumentData>
  >([]);

  const fetchProducts = async () => {
    db.collection("products")
      .get()
      .then((querySnapshot) => {
        const fetchedProducts: Array<firebase.firestore.DocumentData> = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push(doc.data());
          console.log(doc.data());
        });
        setProducts(fetchedProducts);
      });
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
          <Exhibit
            exhibit={{
              name: "Go で作る....",
              userName: "rinka",
              userIcon: "",
              likes: 0,
              createdAt: "10日前",
            }}
          />
          <Exhibit
            exhibit={{
              name: "TypeScriptで作ったアプリ（React + TypeScript）",
              userName: "rinka",
              userIcon: "",
              likes: 0,
              createdAt: "10日前",
            }}
          />
          {products.map((product, index) => (
            <Exhibit
              key={index}
              exhibit={{
                name: product.title,
                userName: product.userName,
                userIcon: "",
                likes: 0,
                createdAt: "10日前",
              }}
            />
          ))}
        </VStack>
      </Flex>
    </Box>
  );
};

export default IndexPage;
