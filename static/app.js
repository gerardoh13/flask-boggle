const guessForm = document.getElementById("guessForm");
const guessInput = document.getElementById("guessInput");
const scoreDisplay = document.getElementById("scoreDisplay");
const playedList = document.getElementById("playedList");
const flashUl = document.getElementById("flash");
let score = 0;
wordsPlayed = [];

guessForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let word = guessInput.value.toLowerCase();
  if (word === ''){
    return
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
    flashUl.innerText = '';
  }, 1000);
}
