import firebase from "firebase";
import { db } from "../../firebase";

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

export const fetchNextLatestProduct = async (
  limitNum: number,
  lastDoc: firebase.firestore.DocumentData | undefined
): Promise<Product> => {
  const newProductsDocs = await db
    .collection("products")
    .where("open", "==", true)
    .orderBy("createdAt", "desc")
    .startAfter(lastDoc)
    .limit(limitNum)
    .get();

  const nextProducts: Array<any> = [];
  newProductsDocs.forEach((productRef) => {
    const productData = productRef.data();
    nextProducts.push({
      id: productRef.id,
      title: productData.title,
      likeCount: productData.likeCount,
      createdAt: productData.createdAt,
      authorId: productData.userId,
    });
  });

  const products:Array<ProductData> = []

  await Promise.all(
    nextProducts.map(async (productData, index: number) => {
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
  return { nextProducts:products, nextDoc: newProductsDocs.docs[limitNum - 1] };
};
