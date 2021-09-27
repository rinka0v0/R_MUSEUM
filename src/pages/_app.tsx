import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import theme from "../theme/theme";
import { AuthProvider } from "../auth/AuthProvider";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ChakraProvider>
    </>
  );
};

export default MyApp;
