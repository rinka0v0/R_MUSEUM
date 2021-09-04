import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState, VFC } from "react";
import Header from "../../components/layout/Header";
import { db } from "../../firebase";
import firebase from "firebase";
import Exhibit from "../../components/card/Exhibit";
import moment from "moment";
import PrimaryButton from "../../components/atoms/button/PrimaryButton";

const LatestPage: VFC = () => {
  const perPage = 2;

  const [nextDoc, setNextDoc]: any = useState();
  const [newProducts, setNewProducts]: Array<any> | undefined = useState([]);
  const [empty, setEmpty] = useState(false);
  const [fetching, setFetching] = useState(true);

  const getSnapshot = async (perPage: number) => {
    const newProductsDocs = await db
      .collection("products")
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
    );

    setNewProducts(popularProductsDataArray);
    if (newProductsDocs.docs[perPage - 1]) {
      setNextDoc(newProductsDocs.docs[perPage - 1]);
    } else {
      setEmpty(true);
    }
    setFetching(false);
  };

  const getNextSnapshot = async (start: any, perPage: number) => {
    setFetching(true);
    const newProductsDocs = await db
      .collection("products")
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
    );

    setNewProducts((prev: any) => [...prev, ...popularProductsDataArray]);

    if (newProductsDocs.docs[perPage - 1]) {
      setNextDoc(newProductsDocs.docs[perPage - 1]);
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
      <Flex align="center" justify="center" flexDirection="column">
        <Flex
          position="relative"
          m="2em 0"
          maxW="960px"
          w="100%"
          flexWrap="wrap"
          justify="space-between"
          _after={{ content: "''", display: "block", width: "calc(100% / 2)" }}
        >
          {newProducts.map((product: any, index: number) => {
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
                      likes: product.likeCount,
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
