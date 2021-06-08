import React, { useState, useEffect } from "react";
import TaskItem from "../components/TaskItem";
import { auth, db } from "../firebase";
import Header from "../components/layout/Header";
import TrendLanguage from "../components/card/TrendLanguage";
import Exhibit from "../components/card/Exhibit";
import PrimaryButton from "../components/atoms/button/PrimaryButton";
import { Box, Flex, Heading, VStack } from "@chakra-ui/layout";

const IndexPage: React.VFC = () => {
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);
  const [input, setInput] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      !user && "ログインされていません";
    });
    return () => unSub();
  }, []);

  useEffect(() => {
    const unSub = db.collection("tasks").onSnapshot((snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({ id: doc.id, title: doc.data().title }))
      );
      return () => unSub();
    });
  }, []);

  const newTask = (e: any) => {
    db.collection("tasks").add({ title: input });
    setInput("");
  };

  return (
    <Box>
      <Header isLogin={isLogin} />
      <Flex align="center" justify="center" flexDirection="column">
        <VStack w="100%" spacing={8}>
          <Box w="80%" mt={10}>
            <TrendLanguage languages={["TypeScript", "Go", "React"]} />
          </Box>
          <Heading as="h2" textAlign="center">
            作品一覧
          </Heading>
          <Exhibit
            exhibit={{
              name: "name",
              userName: "rinka",
              userIcon: "",
              likes: 0,
              createdAt: "10日前",
            }}
          />
          <Exhibit
            exhibit={{
              name: "TypeScriptで作ったアプリ（React + TypeScript）",
              userName: "rinka",
              userIcon: "",
              likes: 0,
              createdAt: "10日前",
            }}
          />

          <PrimaryButton
            onClick={() => {
              setIsLogin(!isLogin);
            }}
          >
            ログイン
          </PrimaryButton>
          {/* <button
            onClick={async () => {
              try {
                await auth.signOut();
                console.log("please login");
              } catch (error) {
                alert(error.message);
              }
            }}
          >
            LOG OUT
          </button> */}
          {/* <button disabled={!input} onClick={newTask}>
            SEND
          </button> */}
        </VStack>
      </Flex>
    </Box>
  );
};

export default IndexPage;
