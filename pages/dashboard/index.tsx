import React, { useContext, useEffect } from "react";
import Router from "next/router";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import Header from "../../components/layout/Header";
import Loading from "../../components/layout/Loading";
import { AuthContext } from "../../auth/AuthProvider";
import DashBoard from "../../components/card/DashBoard";
import { db } from "../../firebase";
import { useState } from "react";
import moment from "moment";
import { Stack } from "@chakra-ui/react";

type ProductData = {
  id: string;
  title: string;
  createdAt: string;
  isOpen: boolean;
};

const Dashbord: React.VFC = () => {
  const { currentUser, signInCheck } = useContext(AuthContext);
  const [products, setProducts] = useState<Array<ProductData>>([]);

  const fetchProducts = async () => {
    await db
      .collection("products")
      .where("userId", "==", currentUser?.uid)
      .get()
      .then((products) => {
        const productList: Array<ProductData> = [];
        products.forEach((product) => {
          const data = product.data();
          const date: string = data.createdAt.toDate().toString();
          productList.push({
            id: product.id,
            title: data.title,
            createdAt: moment(date).fromNow(),
            isOpen: data.open,
          });
        });
        setProducts(productList);
      });
  };

  useEffect(() => {
    !currentUser && Router.push("/");
    fetchProducts();
  }, []);

  if (!signInCheck || !currentUser) {
    return <Loading />;
  }
  return (
    <>
      <Header />
      <Flex flexDirection="column" alignItems="center">
        <Heading fontSize={20} my={5}>
          自分の作品一覧
        </Heading>
        <Stack spacing={5}>
          {products.map((product) => {
            return (
              <Box key={product.id} cursor="pointer">
                <DashBoard
                  url={`/products/${product.id}/edit`}
                  isOpen={product.isOpen}
                  title={product.title}
                  createdAt={product.createdAt}
                />
              </Box>
            );
          })}
        </Stack>
      </Flex>
    </>
  );
};

export default Dashbord;
