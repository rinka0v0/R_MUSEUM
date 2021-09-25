import { Flex } from "@chakra-ui/react";
import Head from "next/head";
import { ReactNode, VFC } from "react";
import Footer from "./Footer";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: VFC<Props> = (props) => {
  return (
    <>
      <Head>
        <title>R_MUSEUM</title>
      </Head>
      <Flex flexDirection="column" minH="100vh">
        <Header />
        <Flex
          as="main"
          align="center"
          justify="center"
          flexDirection="column"
          flex="1"
          mb={5}
        >
          {/* <Box flex="1" as="main"> */}
          {props.children}
          {/* </Box> */}
        </Flex>
        <Footer />
      </Flex>
    </>
  );
};

export default Layout;
