import { useLocalSearchParams } from "expo-router";

import { Post } from "@acme/native";

import { api } from "~/api";

const PostContainer = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = api.post.byId.useQuery({ id: parseInt(id ?? "") });

  if (!data) return null;

  return <Post title={data.title} content={data.content} />;
};

export default PostContainer;
