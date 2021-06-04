import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import theme from "../theme/theme";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      <ChakraProvider theme={theme}>
        <Head>
          <title>R_MUSEUM</title>
        </Head>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
};

export default MyApp;
