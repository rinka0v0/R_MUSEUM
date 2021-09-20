import { Input, InputGroup, InputLeftAddon } from "@chakra-ui/input";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Textarea } from "@chakra-ui/textarea";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import PrimaryButton from "../../components/atoms/button/PrimaryButton";
import Header from "../../components/layout/Header";
import Router from "next/router";
import Loading from "../../components/layout/Loading";
import { db } from "../../firebase";
import useMessage from "../../hooks/useMessage";
import { useWarningOnExit } from "../../hooks/useWarningOnExit";

const EditMyPage: React.VFC = () => {
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [gitHub, setGitHub] = useState("");
  const [updating, setUpdating] = useState(false);

  const { currentUser, signInCheck } = useContext(AuthContext);
  const { showMessage } = useMessage();

  console.log("mypage edit page レンダリングされました");

  const [warningExit, setWarningExit] = useState(true);
  useWarningOnExit(warningExit, "ページを離れてもいいですか？");

  const fetchUser = async () => {
    await db
      .collection("users")
      .doc(currentUser?.uid)
      .get()
      .then(async (userData) => {
        const user = userData.data();
        setName(user?.user_name);
        setProfile(user?.profile);
        setGitHub(user?.gitHub);
        setTwitter(user?.twitter);
        setInstagram(user?.instagram);
      });
  };

  const onClickBtn = async () => {
    setUpdating(true);
    
    db.collection("users")
      .doc(currentUser?.uid)
      .update({
        user_name: name,
        profile,
        gitHub,
        twitter,
        instagram,
      })
      .then(() => {
        setWarningExit(false);
        Router.push("/mypage");
        showMessage({ title: "保存しました", status: "success" });
      })
      .catch(() => {
        showMessage({ title: "エラーが発生しました", status: "error" });
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  useEffect(() => {
    if (!currentUser) {
      setWarningExit(false);
      Router.push("/");
    }
    fetchUser();
  }, [currentUser]);

  if (!signInCheck || !currentUser) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <Flex align="center" justify="center" flexDirection="column" mb={5}>
        <Flex
          w="90%"
          alignItems="center"
          my={10}
          justify="space-around"
          flexDirection={{ base: "column", md: "row" }}
        >
          <Box w="100%">
            <Box border="1px solid #ddd" p={3} borderRadius={3}>
              <Text>ユーザー名</Text>
              <Input
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                }}
              />
            </Box>
            <Box border="1px solid #ddd" p={3} borderRadius={3}>
              <Text>自己紹介</Text>
              <Textarea
                value={profile}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setProfile(e.target.value)
                }
                colorScheme="linkedin"
                placeholder="自己紹介を書こう"
                h="250px"
              ></Textarea>
            </Box>

            <Box>
              <Box border="1px solid #ddd" p={3} borderRadius={3}>
                <Text>GitHubのURL</Text>
                <InputGroup>
                  <InputLeftAddon>http://github.com/</InputLeftAddon>
                  <Input
                    value={gitHub}
                    placeholder="例） rinka0v0"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setGitHub(e.target.value);
                    }}
                  />
                </InputGroup>
              </Box>
              <Box border="1px solid #ddd" p={3} borderRadius={3}>
                <Text>Twitterユーザー名</Text>
                <InputGroup>
                  <InputLeftAddon>https://twitter.com/</InputLeftAddon>
                  <Input
                    value={twitter}
                    placeholder="例） rinka0y0"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setTwitter(e.target.value);
                    }}
                  />
                </InputGroup>
              </Box>
              <Box border="1px solid #ddd" p={3} borderRadius={3}>
                <Text>Instagramユーザー名</Text>
                <InputGroup>
                  <InputLeftAddon>https://instagram.com/</InputLeftAddon>
                  <Input
                    value={instagram}
                    placeholder="例） rinka0x0"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setInstagram(e.target.value);
                    }}
                  />
                </InputGroup>
              </Box>
            </Box>
          </Box>
        </Flex>
        <PrimaryButton onClick={onClickBtn} isLoading={updating}>
          保存
        </PrimaryButton>
      </Flex>
      <></>
    </>
  );
};

export default EditMyPage;
