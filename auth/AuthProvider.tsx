import firebase from "firebase/app";
import { createContext, useEffect, useState, VFC, ReactNode } from "react";
import Loading from "../components/layout/Loading";
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

  const [signInCheck, setSignInCheck] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user, "AuthProvider useEffect");
        setCurrentUser(user);
      }
      setSignInCheck(true);
    });
  }, []);
  if (signInCheck) {
    return (
      <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
        {children}
      </AuthContext.Provider>
    );
  } else {
    return <Loading />;
  }
};

export { AuthContext, AuthProvider };
