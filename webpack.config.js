import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./src/main.js",
  output: {
    path: `${path.resolve(__dirname)}/dist`,
    filename: "bundle.js",
  },
  target: "node14",
  optimization: {
    minimize: true,
  },
};
