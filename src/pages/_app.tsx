import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Footer from "../components/layout/Footer";
import theme from "../theme/theme";
import { AuthProvider } from "../auth/AuthProvider";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Flex flexDirection="column" minH="100vh">
            <Head>
              <title>R_MUSEUM</title>
            </Head>
            <Box flex="1">
              <Component {...pageProps} />
            </Box>
            <Footer />
          </Flex>
        </AuthProvider>
      </ChakraProvider>
    </>
  );
};

export default MyApp;