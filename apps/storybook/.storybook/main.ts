import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../../../packages/ui/src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
  ],
  async viteFinal(config) {
    const { mergeConfig } = await import("vite");
    return mergeConfig(config, {
      plugins: [tailwindcss()],
    });
  },
};

export default config;
