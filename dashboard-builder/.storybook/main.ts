import postcss from "postcss";
import { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    {
      name: "@storybook/addon-postcss",
      options: {
        postcssLoaderOptions: {
          implementation: postcss,
        },
      },
    },
    "@storybook/addon-essentials",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};

export default config;
