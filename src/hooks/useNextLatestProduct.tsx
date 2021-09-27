import { useEffect, useState } from "react";
import { db } from "../firebase";
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
  nextProduct: Array<ProductData> | undefined;
  loading: boolean;
  error: boolean;
};

const fetchNextProduct = async (
  limitNum: number,
  lastDoc: firebase.firestore.DocumentData
) => {
  const newProductsDocs = await db
    .collection("products")
    .where("open", "==", true)
    .orderBy("createdAt", "desc")
    .startAfter(lastDoc)
    .limit(limitNum)
    .get();

  const popularProductsDataArray: Array<any> = [];
  newProductsDocs.forEach((productRef) => {
    const productData = productRef.data();
    popularProductsDataArray.push({
      id: productRef.id,
      title: productData.title,
      likeCount: productData.likeCount,
      createdAt: productData.createdAt,
      authorId: productData.userId,
    });
  });

  await Promise.all(
    popularProductsDataArray.map(async (productData, index: number) => {
      const authorDoc = await db
        .collection("users")
        .doc(productData.authorId)
        .get();

      const authorData = authorDoc.data();
      popularProductsDataArray[index] = {
        ...productData,
        authorName: authorData?.user_name,
        authorIconURL: authorData?.iconURL,
      };
      return;
    })
  );
  return popularProductsDataArray;
};

const useNextLatestProduct = (
  limitNum: number,
  lastDoc: firebase.firestore.DocumentData
): Product => {
  const [nextProduct, setNextProduct] = useState<Array<ProductData>>();
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchNextProduct(limitNum, lastDoc)
      .then((data) => {
        setNextProduct(data);
      })
      .catch(() => {
        setError(true);
      });
  }, []);
  const loading = !nextProduct && !error;
  return { nextProduct, loading, error };
};

export default useNextLatestProduct;
