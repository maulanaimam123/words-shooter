function startGame() {
  let words = $(".word");
  let speeds = [Math.random(), Math.random(), Math.random()];
  let start, previousTimeStamp;
  let speedFactor = 0.001;
  let health = 3;
  let outOfBound = new Set();

  console.log("initialize new game");

  function step(timeStamp) {
    if (start === undefined) {
      start = timeStamp;
    }
    const elapsed = timeStamp - start;

    if (previousTimeStamp !== timeStamp) {
      // update each words location
      for (var i = 0; i < words.length; i++) {
        var offsetTop = words[i].offsetTop;
        var displacement = speedFactor * elapsed * speeds[i];

        // update health info here
        if (offsetTop + displacement > 400 && !outOfBound.has(i)) {
          health -= 1;
          outOfBound.add(i);
        }

        // draw new position
        $(words[i]).css({
          top: offsetTop + displacement,
        });
      }
    }
    previousTimeStamp = timeStamp;
    if (health > 0) {
      window.requestAnimationFrame(step);
    } else {
      console.log("you lose!");
      return;
    }
  }

  window.requestAnimationFrame(step);
}

$(".start-btn").click(startGame);

$(".restart-btn").click(function () {
  $(".word").css({
    top: 0,
  });
});
