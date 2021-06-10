import firebase from "firebase/app";
import { createContext, useEffect, useState, VFC, ReactNode } from "react";
import { auth } from "../firebase";

export type User = firebase.User;

type Props = {
  children: ReactNode;
};

type AuthContextProps = {
  currentUser: User | null | undefined;
  setCurrentUser: any;
};

const AuthContext = createContext<AuthContextProps>({
  currentUser: undefined,
  setCurrentUser: undefined,
});

const AuthProvider: VFC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] =
    useState<User | null | undefined>(undefined);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user, "AuthProvider useEffect");
        setCurrentUser(user);
      }
      console.log("user null", user);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
