import { useEffect, useState } from "react";
import { fetchLatestProduct } from "../utils/fetcher/fetchLatestProduct";
import firebase from "firebase";
import { fetchNextLatestProduct } from "../utils/fetcher/fetchNextLatestProduct";

type ProductData = {
  id: string;
  title: string;
  authorName: string;
  authorIconURL: string;
  likeCount: string;
  createdAt: string;
};

type Product = {
  latestProducts: Array<ProductData> | undefined;
  fetchMoreLatest: () => Promise<void>;
  loading: boolean;
  fetching: boolean;
  error: boolean;
  nextDoc: firebase.firestore.DocumentData | undefined;
};

const useFetchLatestProducts = (limitNum: number): Product => {
  const [latestProducts, setLatestProducts] = useState<Array<ProductData>>();
  const [nextDoc, setNextDoc] = useState<firebase.firestore.DocumentData>();
  const [error, setError] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fetchMoreLatest = async () => {
    setFetching(true);
    try {
      const { nextProducts, nextDoc: nextLatestDoc } =
        await fetchNextLatestProduct(limitNum, nextDoc);
      if (nextProducts) {
        setLatestProducts((prev: any) => [...prev, ...nextProducts]);
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
    fetchLatestProduct(limitNum)
      .then(({ products, nextDoc }) => {
        setLatestProducts(products);
        if (nextDoc) {
          setNextDoc(nextDoc);
        }
      })
      .catch(() => {
        setError(true);
      });
  }, []);
  const loading = !latestProducts && !error;
  return { latestProducts, fetchMoreLatest, loading, fetching, error, nextDoc };
};

export default useFetchLatestProducts;
