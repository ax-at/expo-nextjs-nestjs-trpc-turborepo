import { useLocalSearchParams } from "expo-router";

import { Post } from "@acme/native";

import { trpc } from "~/api";

const PostContainer = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = trpc.post.byId.useQuery({ id: parseInt(id ?? "") });

  if (!data) return null;

  return <Post title={data.title} content={data.content} />;
};

export default PostContainer;
