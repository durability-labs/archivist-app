// import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import packageJson from "./package.json";
import svgr from "vite-plugin-svgr";
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), svgr({
    svgrOptions: {
      plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
      svgoConfig: {
        floatPrecision: 2,
      },
    },
    // ...
  })],
  define: {
    "import.meta.env.PACKAGE_VERSION": JSON.stringify(packageJson.version),
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "@sentry/react": ["@sentry/react"],
          "emoji-picker-react": ["emoji-picker-react"],
          "dotted-map": ["dotted-map"],
          "echarts": ["echarts"],
        }
      },
      onwarn(warning, defaultHandler) {
        if (warning.code === "SOURCEMAP_ERROR") {
          return;
        }

        defaultHandler(warning);
      },
    },

  },
  resolve: {
    alias: {
      "../sdk/archivist": "../proxy",
      "../../sdk/archivist": "../../proxy",
      react: 'preact/compat',
      'react-dom': 'preact/compat'
    },
  },
});
