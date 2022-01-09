import fs from "fs";
import path from "path";

const loadNames = (): Array<string> => {
  let data: Array<string> = [];

  try {
    const buffer = fs.readFileSync(path.join(__dirname, "../../user_names.txt"), "utf8");
    data = buffer.split("\n").map((url) => url.trim());
  } catch (err) {
    console.error(err);
  }

  return data;
};

export default loadNames;
