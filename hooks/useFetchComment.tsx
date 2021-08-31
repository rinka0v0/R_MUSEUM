import useSWR from "swr";
import { db } from "../firebase";

type CommentData = {
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
    fetchedComments.push({
      content: comment.data().content.toString(),
      likes: comment.data().likes,
      createdAt: comment.data().createdAt.toDate().toString(),
      userId: comment.data().userId,
    });
  });
  return fetchedComments;
};

export default useFetchComment;
