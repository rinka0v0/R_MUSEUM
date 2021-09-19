import { Box, Flex, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import moment from "moment";
import router from "next/router";
import { useEffect, useState } from "react";
import { VFC } from "react";
import PrimaryButton from "../../components/atoms/button/PrimaryButton";
import Exhibit from "../../components/card/Exhibit";
import Header from "../../components/layout/Header";
import { db } from "../../firebase";
import firebase from "firebase";

type Products = {
  id: string;
  dataArray: Array<firebase.firestore.DocumentData> | undefined;
};

const TagPage: VFC = () => {
  const perPage = 10;

  const tagName = router.query.tagName;
  const [nextDoc, setNextDoc]: any = useState();
  const [fetching, setFetching] = useState(false);
  const [empty, setEmpty] = useState(true);
  const [products, setProducts] = useState<Products>();

  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const tagsRef = await db
      .collection("tags")
      .where("name", "==", tagName)
      .limit(1)
      .get();
    if (tagsRef.empty) {
      console.log("error");
      setFetching(false);
      return;
    }
    // let tagId: string;
    const tag: Array<string> = [];
    tagsRef.forEach((tagRef) => {
      tag.push(tagRef.id);
    });
    const productRefs = await db
      .collection("products")
      .where("tagsIDs", "array-contains", tag[0])
      .limit(perPage)
      .get();

    const productsDataArray: Array<any> = [];
    productRefs.forEach((productRef) => {
      const productData = productRef.data();
      productsDataArray.push({
        productId: productRef.id,
        title: productData.title,
        likes: productData.likeCount,
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
    );
    if (productRefs.docs[perPage - 1]) {
      setNextDoc(productRefs.docs[perPage - 1]);
      setEmpty(false);
    } else {
      setEmpty(true);
    }
    setProducts({ id: tag[0], dataArray: productsDataArray });
    setLoading(false);
  };

  const getNextSnapshot = async (start: any, perPage: number) => {
    setFetching(true);
    const productRefs = await db
      .collection("products")
      .where("tagsIDs", "array-contains", products?.id)
      .startAfter(start)
      .limit(perPage)
      .get();

    const nextProducts: Array<any> = [];
    productRefs.forEach((productRef) => {
      const productData = productRef.data();
      nextProducts.push({
        productId: productRef.id,
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
    );

    setProducts((prev: any) => {
      return { id: prev?.id, dataArray: [...prev?.dataArray, ...nextProducts] };
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
    <>
      <Header />
      <Flex align="center" justify="center" flexDirection="column">
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
            <Box
              display="inline-block"
              m=".6em"
              p=".6em"
              lineHeight="1"
              textDecoration="none"
              color="#00e"
              backgroundColor="#fff"
              border="1px solid #00e"
              borderRadius="2em"
            >
              {tagName}
            </Box>
            タグがつけられた作品
          </Box>
        </Flex>

        {!loading && !products?.dataArray?.length ? (
          <Box>作品が見つかりませんでした</Box>
        ) : null}

        <Flex
          position="relative"
          m="2em 0"
          maxW="960px"
          w="100%"
          flexWrap="wrap"
          justify="space-between"
          _after={{ content: "''", display: "block", width: "calc(100% / 2)" }}
        >
          {loading
            ? Array(10)
                .fill(0)
                .map((_, index) => {
                  return (
                    <Box
                      key={index}
                      m={{ md: "0.5em auto", base: "0.5em auto" }}
                      p="0"
                      w={{ md: " calc(96%/2)", base: "96%" }}
                    >
                      <Box m="0 auto" w="350px" bg="white" p="12px">
                        <SkeletonText spacing="2" />
                        <SkeletonCircle size="10" mt={2} />
                      </Box>
                    </Box>
                  );
                })
            : products?.dataArray?.map((product: any, index: number) => {
                const date: string = product.createdAt.toDate().toString();
                return (
                  <Box
                    key={index}
                    m={{ md: "0.5em auto", base: "0.5em auto" }}
                    p="0"
                    w={{ md: " calc(96%/2)", base: "96%" }}
                  >
                    <Box m="0 auto" w="350px">
                      <Exhibit
                        exhibit={{
                          id: product.productId,
                          name: product.title,
                          userName: product.authorName,
                          userIcon: product.authorIconURL,
                          likes: product.likes,
                          createdAt: moment(date).fromNow(),
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
        </Flex>
        {empty ? null : (
          <PrimaryButton
            onClick={() => getNextSnapshot(nextDoc, perPage)}
            isLoading={fetching}
          >
            もっと見る
          </PrimaryButton>
        )}
      </Flex>
    </>
  );
};

export default TagPage;
