import { Heading } from "@chakra-ui/react";
import { VFC } from "react";
import PrimaryButton from "../../components/atoms/button/PrimaryButton";
// import useMessage from "../../hooks/useMessage";
import Layout from "../../components/layout/Layout";
import SkeletonList from "../../components/skeleton/SkeletonList";
import ProductList from "../../components/List/ProductList";
import useFetchPopularProducts from "../../hooks/useFetchPopularProduct";

const PopularPage: VFC = () => {
  const perPage = 10;

  // const { showMessage } = useMessage();
  const { popularProducts, fetchMorePopular, loading, fetching, nextDoc } =
    useFetchPopularProducts(perPage);

  return (
    <Layout>
      <Heading mt={5}>人気の投稿</Heading>
      {loading ? (
        <SkeletonList skeletonNumber={10} />
      ) : (
        <ProductList products={popularProducts} />
      )}
      {nextDoc ? (
        <PrimaryButton onClick={fetchMorePopular} isLoading={fetching}>
          もっと見る
        </PrimaryButton>
      ) : null}
    </Layout>
  );
};

export default PopularPage;
