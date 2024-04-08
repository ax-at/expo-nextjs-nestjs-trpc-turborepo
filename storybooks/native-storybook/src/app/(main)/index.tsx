import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";

const App = () => {
  return (
    <SafeAreaView>
      <Text>Hello world</Text>
    </SafeAreaView>
  );
};

const storybookEnabled =
  Constants.expoConfig?.extra?.storybookEnabled === "true";

let EntryPoint = App;

if (storybookEnabled) {
  const StorybookUI = require("../../../.storybook").default; // eslint-disable-line
  // eslint-disable-next-line
  EntryPoint = () => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StorybookUI />
      </SafeAreaView>
    );
  };
}

export default EntryPoint;
