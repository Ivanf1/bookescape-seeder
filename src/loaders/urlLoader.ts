import fs from "fs";
import path from "path";

const loadUrls = (): Array<string> => {
  let data: Array<string> = [];

  try {
    const buffer = fs.readFileSync(path.join(__dirname, "../../urls.txt"), "utf8");
    data = buffer.split("\n").map((url) => url.trim());
  } catch (err) {
    console.error(err);
  }

  return data;
};

export default loadUrls;
