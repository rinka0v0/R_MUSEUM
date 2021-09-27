import { db } from "../../firebase";
import firebase from "firebase";

type ProductData = {
  id: string;
  title: string;
  authorName: string;
  authorIconURL: string;
  likeCount: string;
  createdAt: string;
};

type Product = {
  products: Array<ProductData> | undefined;
  nextDoc: firebase.firestore.DocumentData;
};

export const fetchNextUserProduct = async (
  userId: string,
  limitNum: number,
  lastDoc: firebase.firestore.DocumentData|undefined
): Promise<Product> => {
  const userRef = await db.collection("users").doc(userId).get();
  const userData = userRef.data();
  const productsRef = await db
    .collection("products")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .startAfter(lastDoc)
    .limit(limitNum)
    .get();

  const products: Array<any> = [];
  productsRef.forEach((productRef) => {
    const productData = productRef.data();
    products.push({
      id: productRef.id,
      title: productData.title,
      likes: productData.likeCount,
      createdAt: productData.createdAt,
      authorName: userData?.user_name,
      authorIconURL: userData?.iconURL,
    });
  });

  return { products, nextDoc: productsRef.docs[limitNum - 1] };
};
