const guessForm = document.getElementById("guessForm");
const guessInput = document.getElementById("guessInput");
const scoreDisplay = document.getElementById("scoreDisplay");
const playsCount = document.getElementById("playsCount");
const flashUl = document.getElementById("flash");
const timerDisplay = document.getElementById("timer");
const newGameBtn = document.getElementById("newGame");
const mainDiv = document.getElementById("main");
const highScoreDis = document.getElementById("highscore");

class Game {
  constructor() {
    this.score = 0;
    this.time = 60;
    this.gameOver = true;
    this.timer;
    this.wordsPlayed = [];
  }
  async checkIfValid(word) {
    const bodyFormData = new FormData();
    bodyFormData.append("guess", word);

    const res = await axios({
      url: `/check-word`,
      method: "POST",
      data: bodyFormData,
    });
    this.handleResponse(res.data.result, word);
  }
  async handleResponse(valid, word) {
    if (this.wordsPlayed.indexOf(word) !== -1) {
      valid = "already-played";
    }
    switch (valid) {
      case "not-on-board":
        this.flashMsg(`${word} is not the board`);
        break;
      case "not-word":
        this.flashMsg(`${word} is not a valid word`);
        break;
      case "ok":
        this.validWord(word);
        break;
      case "already-played":
        this.alreadyPlayed(word);
      default:
        return;
    }
  }
  validWord(word) {
    this.wordsPlayed.push(word);
    this.score += word.length;
    scoreDisplay.innerText = `Score: ${this.score}`;
    let newLi = document.createElement("li");
    newLi.innerText = word;
    document.getElementById("playedList").append(newLi);
  }
  alreadyPlayed(word) {
    idx = wordsPlayed.indexOf(word);
    let lis = document.getElementsByTagName("li");
    let dupe = lis[idx];
    dupe.classList.toggle("dupe");
    setTimeout(() => {
      dupe.classList.toggle("dupe");
    }, 500);
  }
  flashMsg(msg, gameOver = false) {
    let newMsg = document.createElement("li");
    newMsg.innerText = msg;
    newMsg.classList.toggle("dupe");
    flashUl.append(newMsg);
    setTimeout(
      () => {
        flashUl.innerText = "";
      },
      gameOver ? 3000 : 1000
    );
  }
  startStop() {
    if (!this.timer) {
      this.timer = setInterval(this.tick.bind(this), 1000);
    } else {
      clearInterval(this.timer);
    }
  }
  clockify(time) {
    let mins = Math.floor(time / 60);
    let secs = time - mins * 60;
    mins = mins < 10 ? "0" + mins : mins;
    secs = secs < 10 ? "0" + secs : secs;
    return `Time: ${mins}:${secs}`;
  }
  tick() {
    if (this.time === 0) {
      this.onGameOver();
    } else {
      this.time--;
      let newTime = this.clockify(this.time);
      if (this.time === 10) {
        timerDisplay.classList.add("dupe");
      }
      timerDisplay.innerText = newTime;
    }
  }
  async onGameOver() {
    this.startStop();
    gameOver = true;
    let score = scoreDisplay.innerText.replace("Score: ", "");
    const bodyFormData = new FormData();
    bodyFormData.append("score", score);
    const res = await axios({
      url: "/game-over",
      method: "POST",
      data: bodyFormData,
    });
    this.updateStats(res.data.newRecord, score);
  }
  updateStats(record, score) {
    let plays = parseInt(playsCount.innerText.replace("Games Played: ", ""));
    console.log(plays);
    if (record) {
      this.flashMsg("New High Score!", true);
      highScoreDis.innerText = `High Score: ${score}`;
    } else {
      this.flashMsg("Better Luck Next Time!", true);
    }
    playsCount.innerText = `Games Played: ${plays + 1}`;
  }
}
boggle = new Game();

guessForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let word = guessInput.value.toLowerCase();
  if (word === "" || gameOver) {
    guessForm.reset();
    return;
  }
  boggle.checkIfValid(word);
  guessForm.reset();
});

newGameBtn.addEventListener("click", () => {
  tds = Array.from(document.querySelectorAll("#boardDiv td"));
  if (tds[0].style.visibility === "") {
    for (let i = 0; i < tds.length; i++) {
      tds[i].style.visibility = "visible";
    }
    gameOver = false;
    guessInput.focus();
    boggle.startStop();
    newGameBtn.innerText = "New Game";
  } else {
    location.reload();
  }
});
