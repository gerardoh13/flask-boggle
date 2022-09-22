const guessForm = document.getElementById("guessForm");
const guessInput = document.getElementById("guessInput");
const scoreDisplay = document.getElementById("scoreDisplay");
const playedList = document.getElementById("playedList");
const flashUl = document.getElementById("flash");
const timerDisplay = document.getElementById("timer")
const newGameBtn = document.getElementById("newGame")
const mainDiv = document.getElementById("main")
let score = 0;
let time = 60;
let gameOver = true
let timer;
wordsPlayed = [];

guessForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let word = guessInput.value.toLowerCase();
  if (word === "" || gameOver) {
    guessForm.reset();
    return;
  }
  checkIfValid(word);
  guessForm.reset();
});

async function checkIfValid(word) {
  const bodyFormData = new FormData();
  bodyFormData.append("guess", word);

  const res = await axios({
    url: `/check-word`,
    method: "POST",
    data: bodyFormData,
  });
  handleResponse(res.data.result, word);
}

async function handleResponse(valid, word) {
  if (wordsPlayed.indexOf(word) !== -1) {
    valid = "already-played";
  }
  switch (valid) {
    case "not-on-board":
      flashMsg(`${word} is not the board`);
      break;
    case "not-word":
      flashMsg(`${word} is not a valid word`);
      break;
    case "ok":
      validWord(word);
      break;
    case "already-played":
      alreadyPlayed(word);
    default:
      return;
  }
}
function validWord(word) {
  wordsPlayed.push(word);
  score += word.length;
  scoreDisplay.innerText = `Score: ${score}`;
  let newLi = document.createElement("li");
  newLi.innerText = word;
  playedList.append(newLi);
}

function alreadyPlayed(word) {
  idx = wordsPlayed.indexOf(word);
  let lis = document.getElementsByTagName("li");
  let dupe = lis[idx];
  dupe.classList.toggle("dupe");
  setTimeout(() => {
    dupe.classList.toggle("dupe");
  }, 500);
}

function flashMsg(msg) {
  newMsg = document.createElement("li");
  newMsg.innerText = msg;
  newMsg.classList.toggle("dupe");
  flashUl.append(newMsg);
  setTimeout(() => {
    flashUl.innerText = "";
  }, 1000);
}

function startStop() {
  if (!timer) {
    timer = accurateInterval(tick, 1000);
  } else {
    timer.cancel();
    timer = "";
  }
}

function clockify(time) {
  let mins = Math.floor(time / 60);
  let secs = time - mins * 60;
  mins = mins < 10 ? "0" + mins : mins;
  secs = secs < 10 ? "0" + secs : secs;
  return `Time: ${mins}:${secs}`;
}

function tick() {
  if (time === 0){
    startStop()
    gameOver = true
    flashMsg("Game Over!")
  } else {
    time--;
    let newTime = clockify(time);
    timerDisplay.innerText = newTime;
  }
}

// Thank you to AlexJWayne for an an accurate way to log time without drifting. https://gist.github.com/AlexJWayne/1431195
// Slightly modified to accept 'normal' interval/timeout format (func, time).
window.accurateInterval = function (fn, time) {
  var cancel, nextAt, timeout, wrapper;
  nextAt = new Date().getTime() + time;
  timeout = null;
  wrapper = function () {
    nextAt += time;
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return fn();
  };
  cancel = function () {
    return clearTimeout(timeout);
  };
  timeout = setTimeout(wrapper, nextAt - new Date().getTime());
  return {
    cancel: cancel,
  };
};

newGameBtn.addEventListener("click", () => {
  if (mainDiv.style.display === "none"){
    console.log('good')
    mainDiv.style.display = ""
    gameOver = false
    startStop()
  }

})