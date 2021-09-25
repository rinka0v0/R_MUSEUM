import { useEffect, useState, VFC } from "react";
import {
  Box,
  Flex,
  Heading,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import Header from "../../components/layout/Header";
import { db } from "../../firebase";
import Exhibit from "../../components/card/Exhibit";
import moment from "moment";
import PrimaryButton from "../../components/atoms/button/PrimaryButton";
import useMessage from "../../hooks/useMessage";

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
    <Box>
      <Header />
      <Flex align="center" justify="center" flexDirection="column" mb={5}>
        <Heading mt={5}>最新の投稿</Heading>
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
            : newProducts.map((product: any, index: number) => {
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

export default LatestPage;