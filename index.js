import { listOfWordsWithFreq, actualWordleWordsList } from "./data.js";
import { writeFileSync } from "node:fs";

const listOfWords = Object.keys(listOfWordsWithFreq);
// console.log(listOfWords);

const medianFreq = median(Object.values(listOfWordsWithFreq));
console.log(medianFreq);
function median(list) {
  //   console.log(list);
  const sorted = Array.from(list).sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}
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

function generatePattern(inputWord, actualWord) {
  if (inputWord.length !== 5 || actualWord.length !== 5) return false;
  let inputWordArray = inputWord.split("");
  let actualWordArray = actualWord.split("");

  let pattern = Array(5).fill(0); // Default to gray (0)
  let actualLetterCounts = {};

  for (let i = 0; i < 5; i++) {
    const letter = actualWordArray[i];
    actualLetterCounts[letter] = (actualLetterCounts[letter] || 0) + 1;
  }

  for (let i = 0; i < 5; i++) {
    if (inputWordArray[i] === actualWordArray[i]) {
      pattern[i] = 2; // Mark as green
      actualLetterCounts[inputWordArray[i]]--; // Reduce available count
    }
  }

  for (let i = 0; i < 5; i++) {
    if (pattern[i] === 0 && actualLetterCounts[inputWordArray[i]] > 0) {
      pattern[i] = 1; // Mark as yellow
      actualLetterCounts[inputWordArray[i]]--; // Reduce available count
    }
  }

  return pattern;
}

function matchesPattern(wordToCheck, patternToCheck, referenceWord) {
  const actualPattern = generatePattern(wordToCheck, referenceWord);
  return patternToCheck.toString() === actualPattern.toString();
}
function isWordFrequent(word) {
  return listOfWordsWithFreq[word] > medianFreq;
}
function expectedWordEfficiency(wordList, word) {
  const totalInfo = totalWordInformation(wordList, word);
  const isWordFrequentEnough = isWordFrequent(word);
  const len = wordList.length;
  const expectedFreqEntropy = isWordFrequentEnough
    ? -(1 / len) * Math.log2(1 / len)
    : 0;

  //   console.log(word, totalInfo, expectedFreqEntropy);
  //   console.log(totalInfo + expectedFreqEntropy);
  return totalInfo + expectedFreqEntropy;
}
function findBestWord(wordList) {
  if (wordList.length == 0) {
    console.error("List is empty");
    return;
  }
  if (wordList.length == 1) {
    return [0, wordList[0]];
  }
  return wordList.reduce(
    (maxWord, word) => {
      const totalInfo = expectedWordEfficiency(wordList, word);
      //   console.log(`Word: ${word}, Info: ${totalInfo}`);
      return totalInfo > maxWord[0] ? [totalInfo, word] : maxWord;
    },
    [0, null]
  );
}

let guesses = [];
function playWordle(currrentTurns, inputWord, wordList, actualWord) {
  guesses.push(inputWord);

  if (inputWord == actualWord) {
    console.log("Guessed word in ", currrentTurns, " attempts");
    return currrentTurns;
  }
  //   console.log(inputWord);
  const pattern = generatePattern(inputWord, actualWord);

  const newWordList = wordList.filter((word) =>
    matchesPattern(inputWord, pattern, word)
  );
  const newInputWord = findBestWord(newWordList)[1];
  return playWordle(currrentTurns + 1, newInputWord, newWordList, actualWord);
}

const startingWord = "tares";

function testAllPreviousWordleWords(startingWord) {
  const modelData = [];
  for (let i = 0; i < actualWordleWordsList.length; i++) {
    const actualWord = actualWordleWordsList[i];
    const score = playWordle(1, startingWord, listOfWords, actualWord);
    console.log(guesses);
    guesses = [];
    modelData.push({ numTurns: score, word: actualWord });
  }

  writeFileSync("modelAccuracy.json", JSON.stringify(modelData));
}

// playWordle(1, startingWord, listOfWords, "allow");
// console.log(guesses);
testAllPreviousWordleWords(startingWord);
// console.log(matchesPattern('zjktk', [1, 0, 0, 0, 0], ''));
