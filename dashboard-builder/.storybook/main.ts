import type { StorybookConfig } from "@storybook/react-vite";
import postcss from "postcss";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",                      // MDX docs pages
    "../src/**/*.stories.@(ts|tsx|js|jsx)" // CSF stories
  ],

  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",

    // Tailwind/PostCSS support
    {
      name: "@storybook/addon-postcss",
      options: {
        postcssLoaderOptions: {
          implementation: postcss,
        },
      },
    }
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  docs: {
    defaultName: "Documentation", // REQUIRED for MDX + Vite
  },
};

export default config;
