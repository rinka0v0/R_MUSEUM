import React, { useState, useEffect } from "react";
import { auth } from "../firebase";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      user && console.log("ユーザーが存在します");
    });
    return () => unSub();
  }, []);

  return (
    <div>
      <h1>{isLogin ? "Login" : "Register"}</h1>
      <br />
      <input
        value={email}
        placeholder="email"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
      />
      <input
        value={password}
        placeholder="password"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
      />
      <button
        onClick={
          isLogin
            ? async () => {
                try {
                  await auth.signInWithEmailAndPassword(email, password);
                  console.log("login success");
                } catch (error) {
                  alert(error.message);
                }
              }
            : async () => {
                try {
                  await auth.createUserWithEmailAndPassword(email, password);
                  console.log("acount created");
                } catch (error) {
                  alert(error.message);
                }
              }
        }
      >
        {isLogin ? "login" : "register"}
      </button>
      <br />
      <span onClick={() => setIsLogin(!isLogin)}>{isLogin ? "create new account" : "back to login"}</span>
    </div>
  );
};

export default Login;
