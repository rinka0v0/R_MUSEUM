import { VFC } from "react";
import { Box, Heading } from "@chakra-ui/react";
import PrimaryButton from "../../components/atoms/button/PrimaryButton";
// import useMessage from "../../hooks/useMessage";
import SkeletonList from "../../components/skeleton/SkeletonList";
import ProductList from "../../components/List/ProductList";
import Layout from "../../components/layout/Layout";
import useFetchLatestProducts from "../../hooks/useFetchLatestProducts";

const LatestPage: VFC = () => {
  const perPage = 1;

  // const { showMessage } = useMessage();  
  const { latestProducts, fetchMoreLatest, loading, fetching, error, nextDoc } =
    useFetchLatestProducts(perPage);

  return (
    <Layout>
      <Heading mt={5}>最新の投稿</Heading>
      {loading ? (
        <SkeletonList skeletonNumber={10} />
      ) : (
        <ProductList products={latestProducts} />
      )}
      {nextDoc ? (
        <PrimaryButton onClick={fetchMoreLatest} isLoading={fetching}>
          もっと見る
        </PrimaryButton>
      ) : null}
      {error ? <Box> エラーが発生しました</Box> : null}
    </Layout>
  );
};

export default LatestPage;
