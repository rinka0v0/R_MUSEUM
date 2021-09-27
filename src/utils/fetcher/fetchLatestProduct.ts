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

export const fetchLatestProduct = async (
  limitNum: number
): Promise<Product> => {
  const data = await db
    .collection("products")
    .orderBy("createdAt", "desc")
    .where("open", "==", true)
    .limit(limitNum)
    .get();

  const fetchedProducts: Array<any> = [];
  data.forEach((doc) => {
    fetchedProducts.push({
      id: doc.id,
      data: doc.data(),
    });
  });

  const products: Array<ProductData> = [];
  await Promise.all(
    fetchedProducts.map(async (product, index) => {
      await db
        .collection("users")
        .doc(product.data.userId)
        .get()
        .then((result) => {
          const user = result.data();
          products[index] = {
            id: product.id,
            title: product.data.title,
            likeCount: product.data.likeCount,
            authorName: user?.user_name,
            authorIconURL: user?.iconURL,
            createdAt: product.data.createdAt,
          };
        })
        .catch((err) => {
          return err;
        });
      return;
    })
  );

  return { products: products, nextDoc: data.docs[limitNum - 1] };
};
