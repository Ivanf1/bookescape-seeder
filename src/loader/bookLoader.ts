import fs from "fs";
import path from "path";

export const readJson = <T>(fileName: string): T | null => {
  let dataFromJson: T | null = null;

  try {
    const buffer = fs.readFileSync(path.join(__dirname, `../../${fileName}.json`), "utf8");
    dataFromJson = JSON.parse(buffer.toString());
  } catch (err) {
    console.error(`${path.join(__dirname, `../../${fileName}.json`)} not found`);
  }

  return dataFromJson;
};

export const writeJson = (fileName: string, data: any) => {
  fs.writeFileSync(path.join(__dirname, `../../${fileName}.json`), JSON.stringify(data));
};
