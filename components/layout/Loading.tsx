/**@jsxRuntime classic */
/** @jsx jsx */
import React from "react";
import { Box } from "@chakra-ui/layout";
import { VFC } from "react";
import { jsx, css, keyframes } from "@emotion/react";

const Loading: VFC = () => {
  const letterFade = keyframes`
    0% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    `;
  const LoadingContainer = css`
    color: #769fcd;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    text-align: center;
    font-size: 10vmin;
    > span {
      opacity: 0;
    }
    > span:first-of-type {
      animation: ${letterFade} 3s ease-in-out infinite;
      animation-delay: 0.1s;
    }

    > span:nth-of-type(2) {
      animation: ${letterFade} 3s ease-in-out infinite;
      animation-delay: 0.3s;
    }

    > span:nth-of-type(3) {
      animation: ${letterFade} 3s ease-in-out infinite;
      animation-delay: 0.5s;
    }

    > span:nth-of-type(4) {
      animation: ${letterFade} 3s ease-in-out infinite;
      animation-delay: 0.7s;
    }

    > span:nth-of-type(5) {
      animation: ${letterFade} 3s ease-in-out infinite;
      animation-delay: 0.7s;
    }

    > span:nth-of-type(6) {
      animation: ${letterFade} 3s ease-in-out infinite;
      animation-delay: 0.7s;
    }

    > span:last-of-type {
      animation: ${letterFade} 3s ease-in-out infinite;
      animation-delay: 0.9s;
    }
  `;
  return (
    <>
      <Box w="100vw" h="100vh" position="relative" bg="e4fbff">
        <Box css={LoadingContainer}>
          <Box as="span" animation={{}}>
            L
          </Box>
          <Box as="span">O</Box>
          <Box as="span">A</Box>
          <Box as="span">D</Box>
          <Box as="span">I</Box>
          <Box as="span">N</Box>
          <Box as="span">G</Box>
        </Box>
      </Box>
    </>
  );
};

export default Loading;
