function startGame() {
  let words = $(".word");
  let speeds = [Math.random(), Math.random(), Math.random()];
  let start, previousTimeStamp;
  let speedFactor = 0.001;
  let health = Number($(".health-score").text());
  let healthScore = $(".health-score");
  let removedIndex = null;

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
        if (offsetTop + displacement > 400) {
          removedIndex = i;
          health -= 1;
          $(healthScore).html(health);
        }

        // draw new position
        $(words[i]).css({
          top: offsetTop + displacement,
        });
      }
    }

    if (removedIndex != null) {
      words.splice(removedIndex, 1);
      speeds.splice(removedIndex, 1);
      removedIndex = null;
    }

    previousTimeStamp = timeStamp;
    if (health > 0) {
      window.requestAnimationFrame(step);
    } else {
      return;
    }
  }

  window.requestAnimationFrame(step);
}

$(".start-btn").click(startGame);

$(".restart-btn").click(function () {
  let healthScore = $(".health-score");
  $(".word").css({
    top: 0,
  });
  $(healthScore).html(3);
});
