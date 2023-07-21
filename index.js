const startBtn = document.getElementById("start-btn");
const level1Btn = document.getElementById("level1-btn");
const level2Btn = document.getElementById("level2-btn");
const level3Btn = document.getElementById("level3-btn");
const playerStartBtn = document.getElementById("player-start-btn");
const anotherCardBtn = document.getElementById("another-card-btn");
const giveUpBtn = document.getElementById("give-up-btn");
const showDealerCardsBtn = document.getElementById("show-dealer-card-btn");
const level1El = document.getElementById("level1");
const level2El = document.getElementById("level2");
const level3El = document.getElementById("level3");
const gameAreaEl = document.getElementById("game-area");
const rulesEl = document.getElementById("rules");
const timerEl = document.getElementById("timer");

startBtn.addEventListener("click", startGame);
level1Btn.addEventListener("click", startLevel);

function startGame() {
  document.getElementById("header").style.display = "none";
  startBtn.style.display = "none";
  level1El.style.display = "block";
}

function startLevel() {
  level1El.style.display = "none";
  gameAreaEl.style.display = "flex";
  timerEl.style.display = "block";
}

// rules and timer elements

// text effect typewriter
document.addEventListener("DOMContentLoaded", typeWriter);

let i = 0;
const txt = "Welcome to the game!";
const speed = 125;

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("demo").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}
