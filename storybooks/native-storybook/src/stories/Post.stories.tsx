import type { Meta, StoryObj } from "@storybook/react";

import { Post } from "@acme/native";

// eslint-disable-next-line
const meta = {
  title: "Post",
  component: Post,
} satisfies Meta<typeof Post>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: "Basic title",
    content: "Basic content",
  },
};
