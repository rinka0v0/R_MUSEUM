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
  nextProducts: Array<ProductData> | undefined;
  nextDoc: firebase.firestore.DocumentData;
};

export const fetchNextPopularProduct = async (
  limitNum: number,
  lastDoc: firebase.firestore.DocumentData | undefined
): Promise<Product> => {
  const popularProductsDocs = await db
    .collection("products")
    .where("open", "==", true)
    .orderBy("likeCount", "desc")
    .where("likeCount", ">", 0)
    .orderBy("createdAt", "desc")
    .startAfter(lastDoc)
    .limit(limitNum)
    .get();

  const popularProductsDataArray: Array<any> = [];
  popularProductsDocs.forEach((productRef) => {
    const productData = productRef.data();
    popularProductsDataArray.push({
      productId: productRef.id,
      title: productData.title,
      likes: productData.likeCount,
      createdAt: productData.createdAt,
      authorId: productData.userId,
    });
  });
  const products: Array<ProductData> = [];

  await Promise.all(
    popularProductsDataArray.map(async (productData, index: number) => {
      const authorDoc = await db
        .collection("users")
        .doc(productData.authorId)
        .get();

      const authorData = authorDoc.data();
      products[index] = {
        ...productData,
        authorName: authorData?.user_name,
        authorIconURL: authorData?.iconURL,
      };
      return;
    })
  );
  return {
    nextProducts: products,
    nextDoc: popularProductsDocs.docs[limitNum - 1],
  };
};
