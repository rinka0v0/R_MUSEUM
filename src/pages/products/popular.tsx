import { Heading } from "@chakra-ui/react";
import { useEffect, useState, VFC } from "react";
import { db } from "../../firebase";
import PrimaryButton from "../../components/atoms/button/PrimaryButton";
import useMessage from "../../hooks/useMessage";
import Layout from "../../components/layout/Layout";
import SkeletonList from "../../components/skeleton/SkeletonList";
import ProductList from "../../components/List/ProductList";

const PopularPage: VFC = () => {
  const perPage = 10;

  const [nextDoc, setNextDoc]: any = useState();
  const [popularProducts, setPopularProducts]: Array<any> | undefined =
    useState([]);
  const [empty, setEmpty] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(true);

  const { showMessage } = useMessage();

  const getSnapshot = async (perPage: number) => {
    const popularProductsDocs = await db
      .collection("products")
      .where("open", "==", true)
      .orderBy("likeCount", "desc")
      .where("likeCount", ">", 0)
      .orderBy("createdAt", "desc")
      .limit(perPage)
      .get();

    const popularProductsDataArray: Array<any> = [];
    popularProductsDocs.forEach((productRef) => {
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
    ).catch(() => {
      showMessage({ title: "エラーが発生しました", status: "error" });
    });

    setPopularProducts(popularProductsDataArray);
    if (popularProductsDocs.docs[perPage - 1]) {
      setNextDoc(popularProductsDocs.docs[perPage - 1]);
      setEmpty(false);
    } else {
      setEmpty(true);
    }
    setLoading(false);
  };

  const getNextSnapshot = async (start: any, perPage: number) => {
    setFetching(true);
    const popularProductsDocs = await db
      .collection("products")
      .where("open", "==", true)
      .orderBy("likeCount", "desc")
      .where("likeCount", ">", 0)
      .orderBy("createdAt", "desc")
      .startAfter(start)
      .limit(perPage)
      .get();

    const popularProductsDataArray: Array<any> = [];
    popularProductsDocs.forEach((productRef) => {
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
    ).catch(() => {
      showMessage({ title: "エラーが発生しました", status: "error" });
    });

    setPopularProducts((prev: any) => [...prev, ...popularProductsDataArray]);

    if (popularProductsDocs.docs[perPage - 1]) {
      setNextDoc(popularProductsDocs.docs[perPage - 1]);
      setEmpty(false);
    } else {
      setEmpty(true);
    }
    setFetching(false);
  };

  useEffect(() => {
    getSnapshot(perPage);
  }, []);

  return (
    <Layout>
      <Heading mt={5}>人気の投稿</Heading>
      {loading ? (
        <SkeletonList skeletonNumber={10} />
      ) : (
        <ProductList products={popularProducts} />
      )}
      {empty ? null : (
        <PrimaryButton
          onClick={() => getNextSnapshot(nextDoc, perPage)}
          isLoading={fetching}
        >
          もっと見る
        </PrimaryButton>
      )}
    </Layout>
  );
};

export default PopularPage;
