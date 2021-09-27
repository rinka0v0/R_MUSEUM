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

export const fetchLikedProduct = async (
  userId: string,
  limitNum: number
): Promise<Product> => {
  const likedProductsDocs = await db
    .collection("users")
    .doc(userId)
    .collection("likedPosts")
    .orderBy("createdAt", "desc")
    .limit(limitNum)
    .get();

  const likedProductsDataArray: Array<any> = [];
  likedProductsDocs.forEach((productRef) => {
    likedProductsDataArray.push({
      ref: productRef.data().postRef,
    });
  });

  const products: Array<ProductData> = [];

  await Promise.all(
    likedProductsDataArray.map(async (productRef, index: number) => {
      const productDoc = await productRef.ref.get();
      if (productDoc.exists) {
        const productData = productDoc.data();
        const authorDoc = await db
          .collection("users")
          .doc(productDoc.data().userId)
          .get();
        const authorData = authorDoc.data();

        products[index] = {
          id: productRef.ref.id,
          authorName: authorData?.user_name,
          authorIconURL: authorData?.iconURL,
          title: productData.title,
          likeCount: productData.likeCount,
          createdAt: productData.createdAt,
        };
      }
      return;
    })
  );

  return { products, nextDoc: likedProductsDocs.docs[limitNum - 1] };
};
