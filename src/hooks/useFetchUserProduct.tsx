import { useEffect, useState } from "react";
import firebase from "firebase";
import { fetchUserProduct } from "../utils/fetcher/fetchUserProduct";
import { fetchNextUserProduct } from "../utils/fetcher/fetchNextUserProduct";

type ProductData = {
  id: string;
  title: string;
  authorName: string;
  authorIconURL: string;
  likeCount: string;
  createdAt: string;
};

type Product = {
  userProducts: Array<ProductData> | undefined;
  fetchMoreProducts: () => Promise<void>;
  loading: boolean;
  fetching: boolean;
  error: boolean;
  nextDoc: firebase.firestore.DocumentData | undefined;
};

const useFetchUserProduct = (limitNum: number, userId: string): Product => {
  const [userProducts, setUserProducts] = useState<Array<ProductData>>();
  const [nextDoc, setNextDoc] = useState<firebase.firestore.DocumentData>();
  const [error, setError] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fetchMoreProducts = async () => {
    setFetching(true);
    try {
      const { products, nextDoc: nextLatestDoc } = await fetchNextUserProduct(
        userId,
        limitNum,
        nextDoc
      );
      if (products) {
        setUserProducts((prev: any) => [...prev, ...products]);
      }
      if (nextLatestDoc) {
        setNextDoc(nextLatestDoc);
      } else {
        setNextDoc(undefined);
      }
    } catch (err) {
      setError(true);
    }
    setFetching(false);
  };

  useEffect(() => {
    fetchUserProduct(userId, limitNum)
      .then(({ products, nextDoc }) => {
        setUserProducts(products);
        if (nextDoc) {
          setNextDoc(nextDoc);
        }
      })
      .catch(() => {
        setError(true);
      });
  }, []);
  const loading = !userProducts && !error;
  return { userProducts, fetchMoreProducts, loading, fetching, error, nextDoc };
};

export default useFetchUserProduct;
