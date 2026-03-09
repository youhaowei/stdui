import { useEffect } from "react";
import type { Preview } from "@storybook/react";
import { StduiProvider } from "@stdui/react/theme";
import { TooltipProvider } from "@stdui/react";
import "@stdui/react/styles";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Theme mode",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
          { value: "system", icon: "browser", title: "System" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? "light";
      const isDark = theme === "dark";

      useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
      }, [isDark]);

      return (
        <StduiProvider defaultMode={theme as "light" | "dark" | "system"}>
          <TooltipProvider>
            <div className="bg-neutral-bg text-neutral-fg min-h-screen p-6">
              <Story />
            </div>
          </TooltipProvider>
        </StduiProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
