import { Input } from "@chakra-ui/input";
import { Box, Heading } from "@chakra-ui/layout";
import React, { useState } from "react";
import Header from "../components/layout/Header";

const Edit: React.VFC = () => {
  const [title, setTitle] = useState("");


  return (
    <>
      <Header isLogin={true} />
      <div>Edit page</div>
      <Input placeholder="作品のタイトル" value={title} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}/>
      <Heading fontSize={20}>使用言語</Heading>
      <Input placeholder='使用言語'/>
      <Heading fontSize={20}>ソースコードのURL</Heading>
      <Input placeholder='sorce code URL' />

      

      

    </>
  );
};

export default Edit;
