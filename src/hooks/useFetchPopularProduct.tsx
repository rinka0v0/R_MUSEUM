import { useEffect, useState } from "react";
import { fetchPopularProduct } from "../utils/fetcher/fetchPopularProduct";
import firebase from "firebase";
import { fetchNextPopularProduct } from "../utils/fetcher/fetchNextPopularProduct";

type ProductData = {
  id: string;
  title: string;
  authorName: string;
  authorIconURL: string;
  likeCount: string;
  createdAt: string;
};

type Product = {
  popularProducts: Array<ProductData> | undefined;
  fetchMorePopular: () => Promise<void>;
  loading: boolean;
  error: boolean;
  nextDoc: firebase.firestore.DocumentData | undefined;
};

const useFetchPopularProducts = (limitNum: number): Product => {
  const [popularProducts, setPopularProducts] = useState<Array<ProductData>>();
  const [nextDoc, setNextDoc] = useState<firebase.firestore.DocumentData>();
  const [error, setError] = useState(false);

  const fetchMorePopular = async () => {
    try {
      const { nextProducts, nextDoc: nextLatestDoc } =
        await fetchNextPopularProduct(limitNum, nextDoc);
      setPopularProducts((prev: any) => [...prev, nextProducts]);
      if (nextLatestDoc) {
        setNextDoc(nextLatestDoc);
      }
    } catch (err) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchPopularProduct(limitNum)
      .then(({ products, nextDoc }) => {
        setPopularProducts(products);
        if (nextDoc) {
          setNextDoc(nextDoc);
        }
      })
      .catch(() => {
        setError(true);
      });
  }, []);
  const loading = !popularProducts && !error;
  return { popularProducts, fetchMorePopular, loading, error, nextDoc };
};

export default useFetchPopularProducts;
