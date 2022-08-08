export function pickRandom(dictionary) {
  return dictionary[Math.floor(Math.random() * dictionary.length)];
}

export function pickConsistent(dictionary, i) {
  return dictionary[i];
}
