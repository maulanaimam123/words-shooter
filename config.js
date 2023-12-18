const gameConfig = {
  easy: {
    wordSpeedMultiplier: 0.025,
    typeSpeeds: [10, 20, 30, 40, 50, 60, 70, 80],
    typeSpeedsWeight: [2, 3, 5, 3, 2, 0, 0, 0], // average 30.0
    minWordLength: 3,
    maxWordLength: 5,
  },
  medium: {
    wordSpeedMultiplier: 0.035,
    typeSpeeds: [10, 20, 30, 40, 50, 60, 70, 80],
    typeSpeedsWeight: [0, 1, 3, 6, 5, 2, 1, 0], // average 43.9
    minWordLength: 4,
    maxWordLength: 7,
  },
  hard: {
    wordSpeedMultiplier: 0.05,
    typeSpeeds: [10, 20, 30, 40, 50, 60, 70, 80],
    typeSpeedsWeight: [0, 1, 2, 3, 6, 5, 3, 1], // average 62.6
    minWordLength: 5,
    maxWordLength: 8,
  },
};

// Export the configuration
export default gameConfig;
