import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "react-native";

// eslint-disable-next-line
const meta = {
  title: "React Native Button",
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: "Hello world",
  },
};
