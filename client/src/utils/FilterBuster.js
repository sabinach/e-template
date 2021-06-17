// Function to generate random number between min and max, both inclusive
function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCharacter() {
  const charCode = randomNumber(33, 126); // non-alphanumeric char code
  return String.fromCharCode(charCode);
}

function addRandomizedCharacter(word) {
  const splitByPunctuation = word.split(/([.,/#!$%^&*;:{}=\-_`~()"'])/);
  if (word.length < 2) {
    return word;
  }
  if (splitByPunctuation.length === 1) {
    const randomIndex = randomNumber(1, word.length - 1);
    return (
      word.substring(0, randomIndex) +
      randomCharacter() +
      word.substring(randomIndex, word.length)
    );
  }
  let returnStr = '';
  splitByPunctuation.forEach((substr) => {
    returnStr = returnStr.concat(addRandomizedCharacter(substr));
  });
  return returnStr;
}

export function addRandomizedCharacters(content) {
  const words = content.split(/([\n\s])/);
  let randomizedContent = '';
  words.forEach((value) => {
    randomizedContent += addRandomizedCharacter(value);
  });
  return randomizedContent;
}
