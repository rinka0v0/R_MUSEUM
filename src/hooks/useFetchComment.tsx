import useSWR from "swr";
import { db } from "../firebase";

type CommentData = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: number;
};

const useFetchComment = (query: string) => {
  const { data, error, mutate } = useSWR(
    `firesote/comment/${query}`,
    () => fetchComments(query),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    commentsData: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

const fetchComments = async (query: string) => {
  const fetchedComments: Array<CommentData> = [];
  const doc = await db
    .collection("products")
    .doc(query)
    .collection("comments")
    .orderBy("createdAt")
    .get();

  doc.forEach((comment) => {
    const data = comment.data();
    fetchedComments.push({
      id: comment.id,
      content: data.content.toString(),
      likes: data.likes,
      createdAt: data.createdAt.toDate().toString(),
      userId: data.userId,
    });
  });
  return fetchedComments;
};

export default useFetchComment;
