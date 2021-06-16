import firebase from "firebase/app";
import { createContext, useEffect, useState, VFC, ReactNode } from "react";
import Loading from "../components/layout/Loading";
import { auth, db } from "../firebase";

export type User = firebase.User;

type Props = {
  children: ReactNode;
};

type AuthContextProps = {
  currentUser: User | null | undefined;
  signInCheck: boolean;
};

const AuthContext = createContext<AuthContextProps>({
  currentUser: undefined,
  signInCheck: false,
});

const AuthProvider: VFC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] =
    useState<User | null | undefined>(undefined);

  const [signInCheck, setSignInCheck] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDoc = await db.collection("users").doc(user.uid).get();
        if (!userDoc.exists) {
          await userDoc.ref.set({
            user_name: user.displayName,
            profile: "",
            iconURL: user.photoURL,
            created_at: firebase.firestore.FieldValue.serverTimestamp(),
          });
        }
        setSignInCheck(true);
      } else {
        setSignInCheck(true);
      }
    });
  });

  if (signInCheck) {
    return (
      <AuthContext.Provider value={{ currentUser, signInCheck }}>
        {children}
      </AuthContext.Provider>
    );
  } else {
    return <Loading />;
  }
};

export { AuthContext, AuthProvider };
