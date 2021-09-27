import { useEffect, useState } from "react";
import firebase from "firebase";
import { fetchLikedProduct } from "../utils/fetcher/fetchLikedProduct";
import { fetchNextLikedProduct } from "../utils/fetcher/fetchNextLikedProduct";

type ProductData = {
  id: string;
  title: string;
  authorName: string;
  authorIconURL: string;
  likeCount: string;
  createdAt: string;
};

type Product = {
  likedProducts: Array<ProductData> | undefined;
  fetchMoreProducts: () => Promise<void>;
  loading: boolean;
  error: boolean;
  nextDoc: firebase.firestore.DocumentData | undefined;
};

const useFetchLikedProduct = (limitNum: number, userId: string): Product => {
  const [likedProducts, setLikedProducts] = useState<Array<ProductData>>();
  const [nextDoc, setNextDoc] = useState<firebase.firestore.DocumentData>();
  const [error, setError] = useState(false);

  const fetchMoreProducts = async () => {
    try {
      const { products, nextDoc: nextLatestDoc } = await fetchNextLikedProduct(
        userId,
        limitNum,
        nextDoc
      );
      setLikedProducts((prev: any) => [...prev, products]);
      if (nextLatestDoc) {
        setNextDoc(nextLatestDoc);
      }
    } catch (err) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchLikedProduct(userId, limitNum)
      .then(({ products, nextDoc }) => {
        setLikedProducts(products);
        if (nextDoc) {
          setNextDoc(nextDoc);
        }
      })
      .catch(() => {
        setError(true);
      });
  }, []);
  const loading = !likedProducts && !error;
  return { likedProducts, fetchMoreProducts, loading, error, nextDoc };
};

export default useFetchLikedProduct;
