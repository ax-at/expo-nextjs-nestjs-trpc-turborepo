import { StorybookConfig } from "@storybook/react-native";

const main: StorybookConfig = {
  stories: ["../src/stories/**/*.stories.?(ts|tsx|js|jsx)"],
  addons: [],
};

export default main;
