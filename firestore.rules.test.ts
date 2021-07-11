import * as firebase from "@firebase/testing";
import * as fs from "fs";

// 認証なしFirestoreクライアントの取得
function getFirestore() {
  const app = firebase.initializeTestApp({
    projectId: "my-test-project",
  });
  return app.firestore();
}

// 認証付きFirestoreクライアントの取得
function getFirestoreWithAuth() {
  const app = firebase.initializeTestApp({
    projectId: "my-test-project",
    auth: { uid: "test" },
  });

  return app.firestore();
}

describe("Firestore rulesのテスト", () => {
  beforeAll(async () => {
    // セキュリティルールの読み込み
    await firebase.loadFirestoreRules({
      projectId: "my-test-project",
      rules: fs.readFileSync("./firestore.rules", "utf8"),
    });
  });

  afterAll(async () => {
    // 使用したアプリの削除
    await Promise.all(firebase.apps().map((app) => app.delete()));
  });

  describe("usersコレクションへの認証アクセスを許可", () => {
    test("認証ユーザーでのデータ保存に成功", async () => {
      const db = getFirestoreWithAuth();
      const doc = db.collection("users").doc("test");
      await firebase.assertSucceeds(
        doc.set(
          {
            // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            gitHub: "dd",
            iconURL: "https://...",
            instagram: "dd",
            profile: "hey! I'm alice!",
            twitter: "dd",
            user_name: "alice",
          },
          { merge: true }
        )
      );
    });
    test("認証済みのアカウントでユーザー情報を更新", async () => {
      const db = getFirestoreWithAuth();
      const doc = db.collection("users").doc("test");
      await firebase.assertSucceeds(
        doc.update({
          // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          gitHub: "dd",
          iconURL: "https://...",
          instagram: "dd",
          profile: "hey! I'm alice!",
          twitter: "dd",
          user_name: "alice",
        })
      );
    });
    test("認証済みのアカウントでユーザー情報をget", async () => {
      const db = getFirestoreWithAuth();
      const doc = db.collection("users").doc("test");
      await firebase.assertSucceeds(doc.get());
    });
  });
  describe("Products コレクション", () => {
    test("承認済みのアカウントでユーザー情報をcreate", async () => {
      const db = getFirestoreWithAuth();
      const doc = db.collection('products').doc('test')
      await firebase.assertSucceeds(doc.set({
        content: '#Hello',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        open: false,
        sorceCode: '',
        tagsIDs: [],
        title: 'Next.jsで作る...',
        userId: 'test'
      },{merge: true}))
    });
  });
});
