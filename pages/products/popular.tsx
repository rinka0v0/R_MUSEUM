import {
  Box,
  Flex,
  Heading,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { useEffect, useState, VFC } from "react";
import Header from "../../components/layout/Header";
import { db } from "../../firebase";
import Exhibit from "../../components/card/Exhibit";
import moment from "moment";
import PrimaryButton from "../../components/atoms/button/PrimaryButton";

const PopularPage: VFC = () => {
  const perPage = 10;

  const [nextDoc, setNextDoc]: any = useState();
  const [popularProducts, setPopularProducts]: Array<any> | undefined =
    useState([]);
  const [empty, setEmpty] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(true);

  const getSnapshot = async (perPage: number) => {
    const popularProductsDocs = await db
      .collection("products")
      //   .where("open", "==", true)
      .orderBy("likeCount", "desc")
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
    );

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
    );

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
    <Box mb={5}>
      <Header />
      <Flex align="center" justify="center" flexDirection="column">
        <Heading mt={5}>人気の投稿</Heading>
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
            : popularProducts.map((product: any, index: number) => {
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
    </Box>
  );
};

export default PopularPage;
