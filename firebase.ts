import firebase from "firebase/app";
import "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();
export const auth = firebase.auth();

export const loginWithGoogle = (): void => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithRedirect(provider)
    .then((result) => {
      console.log(result);
    });
};

export const loginWithGitHub = () => {
  const provider = new firebase.auth.GithubAuthProvider();
  firebase
    .auth()
    .signInWithRedirect(provider)
    .then((result) => {
      console.log(result);
    });
};

export const logout = (): void => {
  auth.signOut().then(() => {
    window.location.reload();
  });
};
