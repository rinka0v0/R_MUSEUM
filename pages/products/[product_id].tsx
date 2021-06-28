import React, { useContext, useState } from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import Header from "../../components/layout/Header";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { useEffect } from "react";
import firebase from "firebase";
import DOMPurify from "dompurify";
import marked from "marked";
import "github-markdown-css";
import { AuthContext } from "../../auth/AuthProvider";
import PrimaryButton from "../../components/atoms/button/PrimaryButton";

const ProductPage: React.VFC = () => {
  const router = useRouter()
  const [product, setProduct] =
    useState<firebase.firestore.DocumentData | undefined>();
  const [html, setHTML] = useState("");

  const { currentUser } = useContext(AuthContext);

  const onClickEdit = () => {
    router.push(`/products/${product?.id}/edit`)
  }
  
  const query = router.asPath.split("/")[2];
  const fetchProduct = async () => {
    db.collection("products")
      .doc(query)
      .get()
      .then(async (product) => {
        if (product) {
          const data = await product.data();
          console.log(data);
          setProduct({data,id:product.id});
          const html = DOMPurify.sanitize(marked(data?.content));
          setHTML(html);
        }
      });
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <Box>
      <Header />
      <Flex alignItems="center" flexDirection="column">
        <Flex alignItems="center" my={5}>
          <Avatar src="https://bit.ly/broken-link" mr={3} ml={3} />
          <Box> name</Box>
        </Flex>
        {currentUser?.uid === product?.data.userId ?<PrimaryButton onClick={onClickEdit}>編集</PrimaryButton> : null}
        <Heading my={5}>{product?.title}</Heading>
        <Heading fontSize={20}>使用技術</Heading>
        <Box>
          {product?.data.tagsIDs.map((tag: string) => {
            return (
              <Box
                key={tag}
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
                {tag}
              </Box>
            );
          })}
        </Box>
        <Box></Box>
        <Box bg="white" minH="300px" className="markdown-body" p={5} w="80%" my={5}>
          <Box
            boxSizing="border-box"
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          ></Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProductPage;
