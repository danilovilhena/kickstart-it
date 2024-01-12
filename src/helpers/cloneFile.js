import fs from "fs";

export default async (source, destination) => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(destination);

    readStream.on("error", reject);
    writeStream.on("error", reject);
    writeStream.on("finish", resolve);

    readStream.pipe(writeStream);
  });
};