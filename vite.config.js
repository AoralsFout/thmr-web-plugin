import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

import pkg from "./package.json" with { type: "json" };

const getGitInfo = () => {
    try {
        return {
            shortHash: execSync("git rev-parse --short HEAD").toString().trim(),
            branch: execSync("git rev-parse --abbrev-ref HEAD")
                .toString()
                .trim(),
        };
    } catch {
        return { shortHash: "unknown", branch: "unknown" };
    }
};

const gitInfo = getGitInfo();

export default defineConfig({
    // CSS 注入插件
    plugins: [cssInjectedByJsPlugin()],
    // 版本注入
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version),
        __GIT_COMMIT__: JSON.stringify(gitInfo.shortHash),
        __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
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
