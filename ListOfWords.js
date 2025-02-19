import { readFileSync } from "fs";

// Read the file synchronously and split by new line
const data = readFileSync("ListOfWords.txt", "utf8");
const listOfWords = data
  .split("\n")
  .map((item) => item.trim().toLowerCase())
  .filter((item) => item !== "");

export default listOfWords;
