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

export const fetchUserProduct = async (
  userId: string,
  limitNum: number
): Promise<Product> => {
  const userRef = await db.collection("users").doc(userId).get();
  const userData = userRef.data();
  const productsRef = await db
    .collection("products")
    .where("userId", "==", userId)
    .where("open", "==", true)
    .orderBy("createdAt", "desc")
    .limit(limitNum)
    .get();

  const products: Array<ProductData> = [];
  productsRef.forEach(async (productRef) => {
    const productData = productRef.data();
    products.push({
      id: productRef.id,
      title: productData.title,
      authorName: userData?.user_name,
      authorIconURL: userData?.iconURL,
      likeCount: productData.likeCount,
      createdAt: productData.createdAt,
    });
  });

  return { products, nextDoc: productsRef.docs[limitNum - 1] };
};
