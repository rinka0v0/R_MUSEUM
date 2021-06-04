import { Input } from "@chakra-ui/input";
import { Flex } from "@chakra-ui/layout";
import React, { useState } from "react";
import PrimaryButton from "../components/atoms/button/PrimaryButton";
import Header from "../components/layout/Header";

const SerchPage: React.VFC = () => {
  const [keyWord, setKeyWord] = useState("");

  const onChangeKeyWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyWord(e.target.value);
  };

  return (
    <>
      <Header isLogin={false} />
      <Flex w="80%" justify="space-between" mx="auto" mt={10}>
        <Input
          placeholder="プログラミング言語で検索"
          value={keyWord}
          onChange={(e) => onChangeKeyWord(e)}
        />
        <PrimaryButton>検索</PrimaryButton>
      </Flex>
    </>
  );
};

export default SerchPage;
