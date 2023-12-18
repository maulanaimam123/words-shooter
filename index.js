import englishWords from "./randomWord.js";
import {
  generateUUID,
  getRandomInterval,
  calculateDistance,
  getRandomWordLength,
} from "./util.js";
import gameConfig from "./config.js";

var health = 5;
var score = 0;
var shouldGenerateAt; // initialized when game starts
const MISSILESPEED = 0.07;
const MAX_Y = 380;
var isGameRunning = false;
var health = Number($(".health-indicator").text());
var difficultyLevel = "easy";
var playingConfig = getPlayingConfig(difficultyLevel);

var words = {
  // words is a map of word Object
  // generated randomly at any moment of the game, removed when cross boundary / hit by missile.
  // example:
  //const words = {
  //   'hello' (string): {
  //     wordId (string): { x: Number, y: Number, speed: Number, followedByMissile: Boolean},
  //   }
  // };
};
var missiles = [
  // missiles is an array that got added when user input match any word and removed when it hit target word:
  // example:
  // [{word: string, wordId: string, x: Number, y: Number, distanceToTarget: Number, speed: Number}]
];

var inputBar = $("#input-bar");

var start, previousTimeStamp;

function generateRandomWords(timeStamp, playingConfig) {
  // utility function to handle new word
  function makeWord(randomWord) {
    let randomId = generateUUID();

    // update words
    if (words[randomWord] == undefined) {
      words[randomWord] = {};
    }
    words[randomWord][randomId] = {
      x: Math.random() * 540, // game area boundary
      y: 0,
      speed: Math.random(),
      followedByMissile: false,
    };
  }

  // check if its on time to generate a word
  if (timeStamp < shouldGenerateAt) return;

  // generate random words via API
  let randomLength = getRandomWordLength(playingConfig);
  $.ajax({
    url: `https://random-word-api.herokuapp.com/word?length=${randomLength}`,
    method: "GET",
    success: function (data) {
      // Handle the response data
      makeWord(data[0]);
    },
    error: function (error) {
      // Handle errors
      let randomWordIndex = Math.floor(Math.random() * englishWords.length);
      let randomWord = englishWords[randomWordIndex];
      makeWord(randomWord);
    },
  });

  // get new time to generate
  shouldGenerateAt = timeStamp + getRandomInterval(playingConfig);
}

function updateGameState(previousTimeStamp, timeStamp, playingConfig) {
  let elapsedTime = timeStamp - previousTimeStamp;

  // update every word
  let newWords = {};
  for (const [wordText, wordObjList] of Object.entries(words)) {
    let newWordObjList = {};
    for (const [wordId, wordObj] of Object.entries(wordObjList)) {
      const { x, y, speed, followedByMissile } = wordObj;
      newWordObjList[wordId] = {
        x: x,
        y: y + elapsedTime * speed * playingConfig.wordSpeedMultiplier, // update y only (dropping motion)
        speed: speed,
        followedByMissile: followedByMissile,
      };
    }
    newWords[wordText] = newWordObjList;
  }
  words = newWords;

  // update every missile
  let newMissiles = [];
  for (let i = 0; i < missiles.length; i++) {
    // update position
    const { word, wordId, x, y, distanceToTarget, speed } = missiles[i];

    // edge case: skip if target word already miss (out of bound)
    if (words[word][wordId] == undefined) continue;

    let newX =
      x -
      (elapsedTime * speed * (x - words[word][wordId].x)) / distanceToTarget;
    let newY =
      y -
      (elapsedTime * speed * (y - words[word][wordId].y)) / distanceToTarget;
    let newMissile = {
      word: word,
      wordId: wordId,
      x: newX,
      y: newY,
      distanceToTarget: calculateDistance(
        newX,
        newY,
        words[word][wordId].x,
        words[word][wordId].y
      ),
      speed: speed,
    };

    // check any missile-word hit
    if (newMissile.distanceToTarget < 5) {
      // update score
      score += 10;
      // delete that wordObj from words[wordText]
      delete words[word][wordId];
    } else {
      // if not hit then save it for the next run
      newMissiles.push(newMissile);
    }
  }
  missiles = newMissiles;

  // check any word out of bound
  for (const [wordText, wordObjList] of Object.entries(words)) {
    for (const [wordId, wordObj] of Object.entries(wordObjList)) {
      const { y } = wordObj;
      if (y > MAX_Y) {
        // update health
        health -= 1;

        // remove from list
        delete words[wordText][wordId];
      }
    }
  }
}

function handleInput(event) {
  // run when Enter / SPACE keypress
  if (event.key == " " || event.key == "Enter") {
    let inputWord = $(inputBar).val();

    // if word not exist then clear input and return
    if (words[inputWord] == undefined) {
      $(inputBar).val("");
      return;
    }

    // if exists, find a word target and follow it
    // iterate over list of item in that word to find the nearest one (take account into duplicate)
    let nearestWordObj = null;
    let newMissile = null;
    for (const [wordId, wordObj] of Object.entries(words[inputWord])) {
      // skip if a missile already following that word item
      if (wordObj.followedByMissile) continue;

      // update nearest word, nearest = max y (nearest to bottom boundary)
      if (nearestWordObj == null || nearestWordObj.y < wordObj.y) {
        nearestWordObj = wordObj;
        newMissile = {
          word: inputWord,
          wordId: wordId,
          speed: MISSILESPEED,
          x: 600 / 2, // middle
          y: 400, // bottom
        };
        newMissile.distanceToTarget = calculateDistance(
          newMissile.x,
          newMissile.y,
          wordObj.x,
          wordObj.y
        );
      }
    }
    if (newMissile != null) {
      // track the word being followed
      words[inputWord][newMissile.wordId].followedByMissile = true;
      missiles.push(newMissile);
    }

    // clear input area
    $(inputBar).val("");
  }
  return;
}

function render() {
  // clear/empty word container children
  let wordContainer = $("#word-container");
  $(wordContainer).empty();

  // list down all words and append as child
  for (const [wordText, wordObjList] of Object.entries(words)) {
    for (const [_, wordObj] of Object.entries(wordObjList)) {
      let wordElement = $(`<span class="word">${wordText}</span>`);
      $(wordElement).css({
        left: wordObj.x,
        top: wordObj.y,
      });
      $(wordContainer).append(wordElement);
    }
  }

  // add children elements for missiles
  for (const [_, missileObj] of Object.entries(missiles)) {
    let missileElement = $("<div class='missile'></div>");
    $(missileElement).css({
      left: missileObj.x,
      top: missileObj.y,
    });
    $(wordContainer).append(missileElement);
  }

  // render health and score indicator
  let healthElement = $(".health-indicator");
  healthElement.text(health);

  let scoreElement = $(".score-indicator");
  scoreElement.text(score);
}

// function to step at game
function step(timeStamp) {
  if (!isGameRunning) {
    return;
  }

  // for starting condition
  if (start === undefined) {
    start = timeStamp;
    shouldGenerateAt = timeStamp + 500; // generate new word 500mS after the game starts
  }

  if (previousTimeStamp !== timeStamp) {
    // generate random words
    generateRandomWords(timeStamp, playingConfig);

    // update state of the game
    updateGameState(previousTimeStamp, timeStamp, playingConfig);

    // render
    render();
  }

  // update previousTimeStamp for next game iteration
  previousTimeStamp = timeStamp;

  // stop if health < 0 (game over condition)
  if (health > 0) {
    window.requestAnimationFrame(step);
  } else {
    return;
  }
}

// Function to start the game
function startGame() {
  isGameRunning = true;

  // remove instruction panel from the screen
  $("#instruction").css({ display: "none" });

  // tie event handler to user input
  $(inputBar).keydown(handleInput);

  window.requestAnimationFrame(step);
}

// Function to restart the game
function restartGame() {
  // set default variables value
  health = 5;
  score = 0;
  words = {};
  missiles = [];
  start = undefined;
  previousTimeStamp = undefined;
  isGameRunning = false;
  render();
}

// Function to pause the game
function pauseGame() {
  // pause the game
  isGameRunning = false;

  // deactivate input bar
  $(inputBar).prop("disabled", true);
}

// Function to resume the game
function resumeGame() {
  // continue game running
  isGameRunning = true;

  // re-activate input bar
  $(inputBar).prop("disabled", false);

  // continue from this point onwards --> avoid rendering jumping
  previousTimeStamp = performance.now();

  // Start the loop again
  window.requestAnimationFrame(step);
}

$(".start-btn").click(startGame);

$(".restart-btn").click(restartGame);

$(".pause-btn").click(pauseGame);

$(".resume-btn").click(resumeGame);

// Function to select game difficulty level
$("#difficulty-form input").on("change", function () {
  difficultyLevel = $(
    "input[name=difficulty-selector]:checked",
    "#difficulty-form"
  ).val();
  playingConfig = getPlayingConfig(difficultyLevel);
});

// Function to set game config based on difficulty level
function getPlayingConfig(difficultyLevel) {
  return gameConfig[difficultyLevel];
}
