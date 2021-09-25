import { useEffect, useState, VFC } from "react";
import { Heading } from "@chakra-ui/react";
import { db } from "../../firebase";
import PrimaryButton from "../../components/atoms/button/PrimaryButton";
import useMessage from "../../hooks/useMessage";
import SkeletonList from "../../components/skeleton/SkeletonList";
import ProductList from "../../components/List/ProductList";
import Layout from "../../components/layout/Layout";

const LatestPage: VFC = () => {
  const perPage = 10;

  const [nextDoc, setNextDoc]: any = useState();
  const [newProducts, setNewProducts]: Array<any> | undefined = useState([]);
  const [empty, setEmpty] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(true);

  const { showMessage } = useMessage();

  const getSnapshot = async (perPage: number) => {
    const newProductsDocs = await db
      .collection("products")
      .where("open", "==", true)
      .orderBy("createdAt", "desc")
      .limit(perPage)
      .get();

    const popularProductsDataArray: Array<any> = [];
    newProductsDocs.forEach((productRef) => {
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

    setNewProducts(popularProductsDataArray);
    if (newProductsDocs.docs[perPage - 1]) {
      setNextDoc(newProductsDocs.docs[perPage - 1]);
      setEmpty(false);
    } else {
      setEmpty(true);
    }
    setLoading(false);
  };

  const getNextSnapshot = async (start: any, perPage: number) => {
    setFetching(true);
    const newProductsDocs = await db
      .collection("products")
      .where("open", "==", true)
      .orderBy("createdAt", "desc")
      .startAfter(start)
      .limit(perPage)
      .get();

    const popularProductsDataArray: Array<any> = [];
    newProductsDocs.forEach((productRef) => {
      const productData = productRef.data();
      popularProductsDataArray.push({
        id: productRef.id,
        title: productData.title,
        likeCount: productData.likeCount,
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

    setNewProducts((prev: any) => [...prev, ...popularProductsDataArray]);

    if (newProductsDocs.docs[perPage - 1]) {
      setNextDoc(newProductsDocs.docs[perPage - 1]);
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
      <Heading mt={5}>最新の投稿</Heading>
      {loading ? (
        <SkeletonList skeletonNumber={10} />
      ) : (
        <ProductList products={newProducts} />
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

export default LatestPage;
