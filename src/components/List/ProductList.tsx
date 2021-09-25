import { Box, Flex } from "@chakra-ui/react";
import moment from "moment";
import { VFC } from "react";
import ProductListItem from "../card/ProductListItem";
import firebase from "firebase";

type Props = {
  products: Array<firebase.firestore.DocumentData>;
};

const ProductList: VFC<Props> = (props) => {
  const { products } = props;

  return (
    <Flex
      m="2em 0"
      maxW="960px"
      w="100%"
      flexWrap="wrap"
      justify="space-between"
      _after={{ content: "''", display: "block", width: "calc(100% / 2)" }}
    >
      {products.map((product, index) => {
        const date: string = product.createdAt.toDate().toString();
        console.log(product.authorIconURL);
        return (
          <Box
            key={index}
            m={{ md: "0.5em auto", base: "0.5em auto" }}
            p="0"
            w={{ md: " calc(96%/2)", base: "96%" }}
          >
            <Box m="0 auto" w="350px">
              <ProductListItem
                product={{
                  id: product.id,
                  title: product.title,
                  authorName: product.authorName,
                  authorIconURL: product.authorIconURL,
                  likeCount: product.likeCount,
                  createdAt: moment(date).fromNow(),
                }}
              />
            </Box>
          </Box>
        );
      })}
    </Flex>
  );
};

export default ProductList;
