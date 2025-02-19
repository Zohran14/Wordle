import listOfWords from "./ListOfWords.js";
import { question } from "readline-sync";

function totalWordInformation(wordList, inputWord) {
  let totalInfo = 0;
  const probList = probabilityList(wordList, inputWord);
  probList.forEach((probability) => {
    if (probability > 0) {
      totalInfo += -probability * Math.log2(probability);
    }
  });
  return totalInfo;
}

function probabilityList(wordList, inputWord) {
  return [...Array(3 ** 5)].map((_, i) => {
    const pattern = i.toString(3).padStart(5, "0").split("").map(Number);
    return patternProbability(wordList, pattern, inputWord);
  });
}

function patternProbability(wordList, pattern, inputWord) {
  const numberOfWordsByPattern = wordList.filter((word) =>
    matchesPattern(word, pattern, inputWord)
  ).length;
  const totalWords = wordList.length;
  return numberOfWordsByPattern / totalWords;
}

function matchesPattern(wordToCheck, pattern, referenceWord) {
  if (
    wordToCheck.length !== pattern.length ||
    wordToCheck.length !== referenceWord.length
  ) {
    return false;
  }

  let wordArray = wordToCheck.split("");
  let referenceArray = referenceWord.split("");

  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === 2) {
      if (wordArray[i] !== referenceArray[i]) return false;
    } else if (pattern[i] === 1) {
      if (
        !wordArray.includes(referenceArray[i]) ||
        wordArray[i] === referenceArray[i]
      )
        return false;
    } else if (pattern[i] === 0) {
      if (wordArray.includes(referenceArray[i])) return false;
    }
  }
  return true;
}
// console.log(totalWordInformation(listOfWords, "slate"));
function sortWords(wordList) {
  const listWithProb = wordList.map((word) => [
    word.toString(),
    totalWordInformation(wordList, word),
  ]);

  // Sort by probability in descending order
  listWithProb.sort((a, b) => b[1] - a[1]);

  return listWithProb;
}
console.log(sortWords(listOfWords.slice(0, 200)));
