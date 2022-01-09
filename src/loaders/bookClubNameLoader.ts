import fs from "fs";
import path from "path";

const loadBookClubNames = (): Array<string> => {
  let data: Array<string> = [];

  try {
    const buffer = fs.readFileSync(path.join(__dirname, "../../book_club.txt"), "utf8");
    data = buffer.split("\n").map((url) => url.trim());
  } catch (err) {
    console.error(err);
  }

  return data;
};

export default loadBookClubNames;
