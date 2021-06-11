import { Button } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, Heading, Stack } from "@chakra-ui/layout";
import Link from "next/link";
import Router from "next/router";
import { FormEvent, useContext, useEffect, useState, VFC } from "react";
import { AuthContext } from "../auth/AuthProvider";
import Header from "../components/layout/Header";
import Loading from "../components/layout/Loading";
import { auth } from "../firebase";
import useMessage from "../hooks/useMessage";

const SignIn: VFC = () => {
  const { currentUser, signInCheck } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);
  const {showMessage} = useMessage()

  const logIn = async (
    e: FormEvent<HTMLFormElement> & FormEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      showMessage({title: 'ログインしました',status: 'success'})
      Router.push("/");
    } catch (err) {
        showMessage({title: err.message,status: 'error'})
    }
  };

  useEffect(() => {
    currentUser && Router.push("/");
  }, [currentUser]);

  if (!signInCheck || currentUser) {
    return <Loading />;
  }
  return (
    <>
      <Header />
      <Box width="80%" mx="auto" textAlign="center" as="form" onSubmit={logIn} mt={5}>
        <Heading>ログイン</Heading>
        <Stack spacing={4}>
          <InputGroup>
            <Input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="email"
            />
          </InputGroup>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="password"
            />
            <InputRightElement w="4.5rem">
              <Button h="1.75em" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          <Button type="submit">Login</Button>
        </Stack>
        <Link href='/signUp'>signup</Link>
      </Box>
    </>
  );
};

export default SignIn;
