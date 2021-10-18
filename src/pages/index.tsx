import React from "react";
import { Heading } from "@chakra-ui/layout";
import PrimaryButton from "../components/atoms/button/PrimaryButton";
import router from "next/router";
// import useMessage from "../hooks/useMessage";
import Layout from "../components/layout/Layout";
import ProductList from "../components/List/ProductList";
import SkeletonList from "../components/skeleton/SkeletonList";
import useFetchLatestProducts from "../hooks/useFetchLatestProducts";
import useFetchPopularProducts from "../hooks/useFetchPopularProduct";
import { Box } from "@chakra-ui/react";
import { fetchLatestProduct } from "../utils/fetcher/fetchLatestProduct";

const IndexPage: React.VFC = () => {
  // const { showMessage } = useMessage();
  console.log("index page rendring!!");
  fetchLatestProduct(1);

  const {
    latestProducts,
    loading: latestLoading,
    error: latestErr,
  } = useFetchLatestProducts(6);

  const {
    popularProducts: popularProducts,
    loading: popularLoading,
    error: popularErr,
  } = useFetchPopularProducts(6);

  
  console.log(latestProducts, "popular");
  console.log(popularProducts, "popular");

  return (
    <Layout>
      <Heading as="h2" textAlign="center" mt={5}>
        新しい作品
      </Heading>
      {latestLoading ? (
        <SkeletonList skeletonNumber={6} />
      ) : (
        <ProductList products={latestProducts} />
      )}
      {latestErr ? <Box>エラーが発生しました</Box> : null}

      {latestProducts?.length == 6 ? (
        <PrimaryButton onClick={() => router.push("/products/latest")}>
          もっと見る
        </PrimaryButton>
      ) : null}
      <Heading as="h2" textAlign="center" mt={5}>
        人気の作品
      </Heading>
      {popularLoading ? (
        <SkeletonList skeletonNumber={6} />
      ) : (
        <ProductList products={popularProducts} />
      )}
      {popularErr ? <Box>エラーが発生しました</Box> : null}
      {popularProducts?.length == 6 ? (
        <PrimaryButton onClick={() => router.push("/products/popular")}>
          もっと見る
        </PrimaryButton>
      ) : null}
    </Layout>
  );
};

export default IndexPage;
