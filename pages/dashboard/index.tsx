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
import { Skeleton, Stack } from "@chakra-ui/react";
import useMessage from "../../hooks/useMessage";

type ProductData = {
  id: string;
  title: string;
  createdAt: string;
  isOpen: boolean;
};

const Dashbord: React.VFC = () => {
  const { currentUser, signInCheck } = useContext(AuthContext);
  const [products, setProducts] = useState<Array<ProductData>>([]);
  const [loading, setLoading] = useState(true);
  const { showMessage } = useMessage();

  const fetchProducts = async () => {
    await db
      .collection("products")
      .where("userId", "==", currentUser?.uid)
      .where("saved", "==", true)
      .orderBy("createdAt", "desc")
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
      })
      .catch(() => {
        showMessage({ title: "エラーが発生しました", status: "error" });
      });
  };

  useEffect(() => {
    !currentUser && Router.push("/");
    fetchProducts().then(() => {
      setLoading(false);
    });
  }, []);

  if (!signInCheck || !currentUser) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <Flex flexDirection="column" alignItems="center" mb={5}>
        <Heading fontSize={20} my={5}>
          自分の作品一覧
        </Heading>
        <Stack spacing={5}>
          {loading ? (
            <>
              {Array(10)
                .fill(0)
                .map((_, index) => {
                  return <Skeleton height="74px" w="300px" key={index} />;
                })}
            </>
          ) : products.length ? (
            products.map((product) => {
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
            })
          ) : (
            <Box>投稿が見つかりません</Box>
          )}
        </Stack>
      </Flex>
    </>
  );
};

export default Dashbord;
