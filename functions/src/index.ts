import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) {
  admin.initializeApp();
  admin.firestore().settings({timestampsInSnapshots: true});
}

const db = admin.firestore();
const storage = admin.storage();

exports.scheduledFunction = functions.pubsub
    .schedule("every 1 hours")
    .onRun(async () => {
    // firestore /products/productId のなかで保存されていないものを削除する。
      const productsDoc = await db
          .collection("products")
          .where("open", "==", false)
          .get();

      productsDoc.docs.forEach((doc) => {
        db.collection("products").doc(doc.id).delete();
      });
      return null;
    });

// 削除された投稿にあるコメント情報を削除
exports.deleteComments = functions.firestore
    .document("products/{productId}")
    .onDelete(async (snap, context) => {
      const deletedValue = snap.data();
      if (!deletedValue) {
        return;
      }
      const productId = context.params.productId;
      try {
        const comments = await db
            .collection("products")
            .doc(productId)
            .collection("comments")
            .get();
        if (!comments.empty) {
          comments.docs.forEach((doc) => {
            db.collection("products")
                .doc(productId)
                .collection("comments")
                .doc(doc.id)
                .delete();
          });
        }
      } catch (err) {
        console.log(err);
      }
    });

// // 削除された投稿のいいね情報を削除する
exports.deletelikedProduct = functions.firestore
    .document("products/{productId}")
    .onDelete(async (snap, context) => {
      const deletedValue = snap.data();
      if (!deletedValue) {
        return;
      }
      const productId = context.params.productId;
      try {
        const likedUsers = await db
            .collection("products")
            .doc(productId)
            .collection("likedUsers")
            .get();
        if (!likedUsers.empty) {
          likedUsers.docs.forEach((doc) => {
            db.collection("products")
                .doc(productId)
                .collection("likedUsers")
                .doc(doc.id)
                .delete();
          });
        }
      } catch (err) {
        console.log(err);
      }
    });

// 削除された投稿をいいねしていたユーザーからいいね情報を削除する
exports.deletelikedUser = functions.firestore
    .document("products/{productId}/likedUsers/{userId}")
    .onDelete(async (snap, context) => {
      const deletedValue = snap.data();
      if (!deletedValue) {
        return;
      }
      const userId = context.params.userId;
      const productId = context.params.productId;
      try {
        db.collection("users")
            .doc(userId)
            .collection("likedPosts")
            .doc(productId)
            .delete();
      } catch (err) {
        console.log(err);
      }
    });

// 削除された投稿のタグを削除
exports.deleteProductIdFromTags = functions.firestore
    .document("products/{productId}")
    .onDelete(async (snap, context) => {
      const deletedValue = snap.data();
      if (!deletedValue) {
        return;
      }
      const productId = context.params.productId;
      const tagIdArray = deletedValue.tagsIDs;
      if (tagIdArray.length) {
        try {
          tagIdArray.map((tagId:string) => {
            db.collection("tags")
                .doc(tagId)
                .collection("productId")
                .doc(productId)
                .delete();
          });
        } catch (err) {
          console.log(err);
        }
      }
    });

// タグずけされなくなったタグを削除する
exports.deleteTag = functions.firestore
    .document("tags/{tagId}/productId/{productId}")
    .onDelete(async (snap, context) => {
      const deletedValue = snap.data();
      if (!deletedValue) {
        return;
      }
      const tagId = context.params.tagId;
      try {
        const products = await db.collection("tags")
            .doc(tagId).collection("productId").get();
        if (products.empty) {
          db.collection("tags").doc(tagId).delete();
        }
      } catch (err) {
        console.log(err);
      }
    });

// 削除された投稿の画像を削除
exports.deleteProductStorage = functions.firestore
    .document("products/{productId}")
    .onDelete((snapshot, context) => {
      const productId = context.params.productId;
      const path = `images/${productId}`;
      return storage.bucket().deleteFiles({
        prefix: path,
      });
    });
