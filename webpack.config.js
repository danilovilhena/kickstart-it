import path from "path";
import { fileURLToPath } from "url";
import webpack from "webpack";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./src/main.js",
  output: {
    path: `${path.resolve(__dirname)}/dist`,
    filename: "bundle.cjs",
  },
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
  ],
  target: "node",
  optimization: {
    minimize: true,
  },
};
