const startBtn = document.getElementById("start-btn");
const level1Btn = document.getElementById("level1-btn");
const level2Btn = document.getElementById("level2-btn");
const level3Btn = document.getElementById("level3-btn");
const playerStartBtn = document.getElementById("player-start-btn");
const newCardBtn = document.getElementById("new-card-btn");
const noNewCardBtn = document.getElementById("no-new-card-btn");
const level1El = document.getElementById("level1");
const level2El = document.getElementById("level2");
const level3El = document.getElementById("level3");
const gameAreaEl = document.getElementById("game-area");
const timerEl = document.getElementById("timer");
let deckId = "";
let dealerScore = 0;
let playerScore = 0;
const replace = {
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
  JACK: "10",
  QUEEN: "10",
  KING: "10",
  ACE: "1",
};

document.getElementById("rules").addEventListener("click", function () {
  document.getElementById("rules-modal").style.display = "block";
});
document
  .getElementById("close-rules-btn")
  .addEventListener("click", function () {
    document.getElementById("rules-modal").style.display = "none";
  });
startBtn.addEventListener("click", startBlackjack);
level1Btn.addEventListener("click", () => {
  startLevel();
});
playerStartBtn.addEventListener("click", () => {
  playerStartBtn.disabled = true;

  playerScore = 0;
  dealerScore = 0;
  getCards(2, "dealer");
  getCards(2, "player");
});
noNewCardBtn.addEventListener("click", endGame);
newCardBtn.addEventListener("click", () => getCards(1, "player"));

function startBlackjack() {
  document.getElementById("header").style.display = "none";
  startBtn.style.display = "none";
  level1El.style.display = "block";
}

function startLevel() {
  level1El.style.display = "none";
  gameAreaEl.style.display = "flex";
  timerEl.style.display = "block";

  startCountdown();
  getDeck();
}

function getDeck() {
  fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
    .then((res) => res.json())
    .then((data) => {
      deckId = data.deck_id;
      console.log(deckId);
    });
}

function getCards(num, player) {
  let cardsHtml = "";
  fetch(
    `https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=${num}`
  )
    .then((res) => res.json())
    .then((data) => {
      cardsHtml = data.cards
        .map((el) => {
          return `
    <img class="card placeholder" src="${el.image}"/>
    `;
        })
        .join("");

      renderCards(num, player, cardsHtml, data);
    });
}

function renderCards(num, player, cardsHtml, data) {
  if (num == 1) {
    document.getElementById(`${player}-cards`).innerHTML += cardsHtml;
    determineWinner(player, data);
  } else {
    document.getElementById(`${player}-cards`).innerHTML = cardsHtml;
    determineWinner(player, data);
  }
}

function determineWinner(player, data) {
  if (player === "player") {
    playerScore += data.cards
      .map((el) => replace[el.value])
      .map((el) => +el)
      .reduce((sum, el) => sum + el);
  } else {
    dealerScore += data.cards
      .map((el) => replace[el.value])
      .map((el) => +el)
      .reduce((sum, el) => sum + el);
  }

  console.log("dealer", dealerScore);
  console.log("player", playerScore);

  if (playerScore < 21) {
    newCardBtn.disabled = false;
    noNewCardBtn.disabled = false;
  } else endGame();
}

function endGame() {
  if (playerScore === 21) {
    if (dealerScore === 21) {
      console.log("both win");
    } else {
      console.log("Blackjack you win");
    }
  } else if (playerScore > 21) {
    if (dealerScore > 21) {
      console.log("you both lose");
    } else {
      console.log("you lose");
    }
  } else if (playerScore < 21) {
    if (dealerScore > 21) {
      console.log("you win");
    } else if (playerScore > dealerScore) {
      console.log("you win");
    } else if (playerScore < dealerScore) {
      console.log("you lose");
    }
  }

  newCardBtn.disabled = true;
  noNewCardBtn.disabled = true;
  playerStartBtn.disabled = false;
}

// rules and timer elements
function startCountdown() {
  let count = 10;
  let timer = setInterval(function () {
    document.getElementById("timer").innerHTML = count--;
    if (count === -1) {
      clearInterval(timer);
      console.log("time is up");
    }
  }, 1000);
}

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
