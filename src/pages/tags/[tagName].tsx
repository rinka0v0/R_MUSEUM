import { Box, Flex } from "@chakra-ui/react";
import router from "next/router";
import { useEffect, useState } from "react";
import { VFC } from "react";
import PrimaryButton from "../../components/atoms/button/PrimaryButton";
import { db } from "../../firebase";
import firebase from "firebase";
import useMessage from "../../hooks/useMessage";
import SkeletonList from "../../components/skeleton/SkeletonList";
import ProductList from "../../components/List/ProductList";
import Layout from "../../components/layout/Layout";
import Tag from "../../components/card/Tag";

const TagPage: VFC = () => {
  const perPage = 10;

  const tagName = router.query.tagName;
  const [nextDoc, setNextDoc]: any = useState();
  const [fetching, setFetching] = useState(false);
  const [empty, setEmpty] = useState(true);
  const [products, setProducts] = useState<
    Array<firebase.firestore.DocumentData> | undefined
  >([]);
  const [loading, setLoading] = useState(true);

  const { showMessage } = useMessage();

  const fetchProducts = async () => {
    const productRefs = await db
      .collection("products")
      .where("tagsIDs", "array-contains", tagName)
      .where("open", "==", true)
      .orderBy("createdAt", "desc")
      .limit(perPage)
      .get();

    const productsDataArray:
      | Array<firebase.firestore.DocumentData>
      | undefined = [];
    productRefs.forEach((productRef) => {
      const productData = productRef.data();
      productsDataArray.push({
        id: productRef.id,
        title: productData.title,
        likeCount: productData.likeCount,
        createdAt: productData.createdAt,
        authorId: productData.userId,
      });
    });

    await Promise.all(
      productsDataArray.map(async (productData, index: number) => {
        const authorDoc = await db
          .collection("users")
          .doc(productData.authorId)
          .get();

        const authorData = authorDoc.data();
        productsDataArray[index] = {
          ...productData,
          authorName: authorData?.user_name,
          authorIconURL: authorData?.iconURL,
        };
        return;
      })
    ).catch(() => {
      showMessage({ title: "エラーが発生しました", status: "error" });
    });
    if (productRefs.docs[perPage - 1]) {
      setNextDoc(productRefs.docs[perPage - 1]);
      setEmpty(false);
    } else {
      setEmpty(true);
    }

    setProducts(productsDataArray);
    setLoading(false);
  };

  const getNextSnapshot = async (start: any, perPage: number) => {
    setFetching(true);
    const productRefs = await db
      .collection("products")
      .where("tagsIDs", "array-contains", tagName)
      .startAfter(start)
      .limit(perPage)
      .get();

    const nextProducts: Array<any> = [];
    productRefs.forEach((productRef) => {
      const productData = productRef.data();
      nextProducts.push({
        id: productRef.id,
        title: productData.title,
        likes: productData.likeCount,
        createdAt: productData.createdAt,
        authorId: productData.userId,
      });
    });

    await Promise.all(
      nextProducts.map(async (productData, index: number) => {
        const authorDoc = await db
          .collection("users")
          .doc(productData.authorId)
          .get();

        const authorData = authorDoc.data();
        nextProducts[index] = {
          ...productData,
          authorName: authorData?.user_name,
          authorIconURL: authorData?.iconURL,
        };
        return;
      })
    ).catch(() => {
      showMessage({ title: "エラーが発生しました", status: "error" });
    });

    setProducts((prev: any) => {
      return [...prev, ...nextProducts];
    });

    if (productRefs.docs[perPage - 1]) {
      setNextDoc(productRefs.docs[perPage - 1]);
      setEmpty(false);
    } else {
      setEmpty(true);
    }
    setFetching(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Layout>
      <Flex
        border="1px solid #ddd"
        bg="white"
        borderRadius="md"
        p={5}
        justify="center"
        width="90%"
        m="2em auto"
      >
        <Box>
          <Tag tagName={String(tagName)} />
          タグがつけられた作品
        </Box>
      </Flex>

      {!loading && !products?.length ? (
        <Box>作品が見つかりませんでした</Box>
      ) : null}

      {loading ? (
        <SkeletonList skeletonNumber={10} />
      ) : (
        <ProductList products={products} />
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

export default TagPage;
