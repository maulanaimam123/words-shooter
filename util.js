function _getRandomWeightedElement(elements, weights) {
  // Calculate the total weight
  const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);

  // Generate a random number between 0 and the total weight
  const randomWeight = Math.random() * totalWeight;

  // Iterate through the elements and find the one corresponding to the random weight
  let cumulativeWeight = 0;
  for (let i = 0; i < elements.length; i++) {
    cumulativeWeight += weights[i];
    if (randomWeight < cumulativeWeight) {
      return elements[i];
    }
  }

  // This should not happen, but just in case
  return null;
}

export function getRandomWordLength(playingConfig) {
  let randomLength =
    Math.floor(
      Math.random() *
        (playingConfig.maxWordLength - playingConfig.minWordlength)
    ) + playingConfig.minWordlength;
  return randomLength;
}

export function getRandomInterval(playingConfig) {
  // get random speed
  const typeSpeeds = playingConfig.typeSpeeds;
  const typeSpeedsWeight = playingConfig.typeSpeedsWeight;
  let randomSpeed = _getRandomWeightedElement(typeSpeeds, typeSpeedsWeight);

  // convert wpm to ms interval
  return Math.floor(1000 / (randomSpeed / 60));
}

export function generateUUID() {
  let d = new Date().getTime(); //Timestamp
  let d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxy".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2, (y1 - y2) ** 2);
}
