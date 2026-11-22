import { resolve } from "node:path";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
    // CSS 注入插件
    plugins: [cssInjectedByJsPlugin()],
    build: {
        lib: {
            entry: resolve(import.meta.dirname, "src/main.ts"),
            // 全局变量名，script 引入后可通过 window.ThmrWebPlugin 访问
            name: "ThmrWebPlugin",
            fileName: () => "thmr.js",
            // 生成可通过 <script> 直接引入的 UMD 格式
            formats: ["umd"],
        },
        // 禁止 CSS 代码分割
        cssCodeSplit: false,
        // 禁止代码分割
        codeSplit: false,
        // 确保所有资源（包括 CSS）都被内联
        assetsInlineLimit: Number.MAX_SAFE_INTEGER,
        sourcemap: false,
    },
});
