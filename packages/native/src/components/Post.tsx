import { SafeAreaView, Text, View } from "react-native";
import { Stack } from "expo-router";

interface PostData {
  title: string;
  content: string;
}

export default function Post({ title, content }: PostData) {
  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: title }} />
      <View className="h-full w-full p-4">
        <Text className="py-2 text-3xl font-bold text-primary">{title}</Text>
        <Text className="py-4 text-foreground">{content}</Text>
      </View>
    </SafeAreaView>
  );
}
