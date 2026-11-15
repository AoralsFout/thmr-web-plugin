import { exec } from "child_process";
import path from "path";
import fs from "fs";

const parentDir = path.join(import.meta.dirname, "..");

// 打包插件
exec("tsc && vite build", { cwd: parentDir }, (err, stdout, stderr) => {
  if (err) {
    console.error(err.message);
    return;
  }
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
  // 复制打包产物到 test/import/scripts，进行实际加载测试。
  try {
    const buildDir = path.join(parentDir, "dist", "thmr.umd.cjs");
    const scriptsDir = path.join(
      parentDir,
      "test",
      "import",
      "scripts",
      "thmr.umd.cjs",
    );
    fs.copyFileSync(buildDir, scriptsDir);
    console.log(`复制完成: ${scriptsDir}`);
  } catch (err) {
    console.error(err.message);
  }
});
