const gameConfig = {
  easy: {
    wordSpeedMultiplier: 0.025,
    typeSpeeds: [10, 20, 30, 40, 50, 60, 70, 80],
    typeSpeedsWeight: [2, 3, 5, 3, 2, 0, 0, 0], // average 30.0
    minWordlength: 3,
    maxWordLength: 5,
  },
  medium: {
    wordSpeedMultiplier: 0.035,
    typeSpeeds: [10, 20, 30, 40, 50, 60, 70, 80],
    typeSpeedsWeight: [1, 2, 6, 4, 3, 2, 1, 0], // average 38.4
    minWordlength: 4,
    maxWordLength: 6,
  },
  hard: {
    wordSpeedMultiplier: 0.05,
    typeSpeeds: [10, 20, 30, 40, 50, 60, 70, 80],
    typeSpeedsWeight: [0, 0, 3, 4, 5, 6, 2, 1], // average 51.4
    minWordlength: 4,
    maxWordLength: 8,
  },
};

// Export the configuration
export default gameConfig;
