import type { Meta, StoryObj } from "@storybook/react";

import LocalPost from "./LocalPost";

// eslint-disable-next-line
const meta = {
  title: "Local Post",
  component: LocalPost,
} satisfies Meta<typeof LocalPost>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: "Local title",
    content: "Local content",
  },
};
