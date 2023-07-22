// messsage tie and dealer blackjack
// implement ACE
// play with two decks

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
let cardsHtmlDealerComplete = "";
let winningGames = 0;
let inLevel1 = true;
let inLevel2 = false;
let inLevel3 = false;
let earlyEnd = false;
let timer;
let remainingCardsInDeck;
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
  ACE: "11",
};

function checkGame() {
  if (inLevel1 && winningGames > 2) {
    earlyEnd = true;
    continueGame();
  }
  if (inLevel2 && winningGames > 3) {
    earlyEnd = true;
    continueGame();
  }
  if (inLevel3 && winningGames > 4) {
    earlyEnd = true;
    continueGame();
  }
}

document.getElementById("rules").addEventListener("click", () => {
  document.getElementById("rules-modal").style.display = "block";
});
document.getElementById("close-rules-btn").addEventListener("click", () => {
  document.getElementById("rules-modal").style.display = "none";
});
startBtn.addEventListener("click", startBlackjack);
level1Btn.addEventListener("click", startLevel);
playerStartBtn.addEventListener("click", startGame);
noNewCardBtn.addEventListener("click", endGame);
newCardBtn.addEventListener("click", () => getCards(1, "player"));

level2Btn.addEventListener("click", startLevel);
level3Btn.addEventListener("click", startLevel);

function startGame() {
  playerStartBtn.disabled = true;
  playerScore = 0;
  dealerScore = 0;
  getCards(2, "dealer");
  getCards(2, "player");
}

function startBlackjack() {
  document.getElementById("header").style.display = "none";
  startBtn.style.display = "none";
  level1El.style.display = "block";
}

function startLevel() {
  level1El.style.display = "none";
  level2El.style.display = "none";
  level3El.style.display = "none";
  gameAreaEl.style.display = "flex";
  document.getElementById(
    "dealer-cards"
  ).innerHTML = ` <div class="placeholder" id="placeholder"></div>
  <div class="placeholder no-show">?</div>`;
  document.getElementById(
    "player-cards"
  ).innerHTML = `<div class="placeholder"></div>
  <div class="placeholder"></div>`;
  playerStartBtn.disabled = false;

  timerEl.style.display = "block";
  winningGames = 0;
  document.getElementById("score").textContent = `Games won: ${winningGames}`;
  getDeck();
  if (inLevel1) startCountdown();
  else if (inLevel2 || (inLevel3 && earlyEnd === true)) {
    setTimeout(function () {
      earlyEnd = false;
      startCountdown();
    }, 500);
  }
}

function getDeck() {
  fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
    .then((res) => res.json())
    .then((data) => {
      deckId = data.deck_id;
      remainingCardsInDeck = data.remaining;
      console.log(data);
      console.log(remainingCardsInDeck);
    });
}

function getCards(num, player) {
  let cardsHtml = "";
  fetch(
    `https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=${num}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (player === "dealer") {
        cardsHtml = `
        <img class="card placeholder" src="${data.cards[0].image}"/>
        <div class="placeholder no-show">?</div>
        `;
        cardsHtmlDealerComplete = data.cards
          .map((el) => {
            return `
    <img class="card placeholder" src="${el.image}"/>
    `;
          })
          .join("");
      } else {
        cardsHtml = data.cards
          .map((el) => {
            return `
    <img class="card placeholder" src="${el.image}"/>
    `;
          })
          .join("");
      }

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

  if (playerScore < 22) {
    newCardBtn.disabled = false;
    noNewCardBtn.disabled = false;
  } else endGame();
}

function endGame() {
  if (playerScore === 21) {
    if (dealerScore === 21) {
      displayResultMessage("it's a tie");
      renderWinningGames();
    } else {
      displayResultMessage("Blackjack!! you win");
      renderWinningGames();
    }
  } else if (playerScore > 21) {
    if (dealerScore > 21) {
      displayResultMessage("you both lose");
    } else if (dealerScore === 21) {
      displayResultMessage("Blackjack dealer");
    } else {
      displayResultMessage("you lose");
    }
  } else if (playerScore < 21) {
    if (dealerScore > 21) {
      displayResultMessage("you win");
      renderWinningGames();
    } else if (dealerScore === 21) {
      displayResultMessage("Blackjack dealer");
    } else if (playerScore > dealerScore) {
      displayResultMessage("you win");
      renderWinningGames();
    } else if (playerScore < dealerScore) {
      displayResultMessage("you lose");
    } else if (playerScore === dealerScore) {
      displayResultMessage("it's a tie");
    }
  }
  document.getElementById("dealer-cards").innerHTML = cardsHtmlDealerComplete;
  newCardBtn.disabled = true;
  noNewCardBtn.disabled = true;
  playerStartBtn.disabled = false;
}

function renderWinningGames() {
  winningGames += 1;
  document.getElementById("score").textContent = `Games won: ${winningGames}`;
  checkGame();
}
// rules and timer elements
function startCountdown() {
  let count = 60;
  let timer = setInterval(function () {
    document.getElementById("countdown").innerHTML = count--;
    if (earlyEnd) clearInterval(timer);
    if (count === -1) {
      clearInterval(timer);
      newCardBtn.disabled = true;
      noNewCardBtn.disabled = true;
      playerStartBtn.disabled = true;
      displayResultMessage("time is up", 4000);
      continueGame();
    }
  }, 1000);
}

function continueGame() {
  if (inLevel1) {
    if (winningGames > 2) {
      inLevel1 = false;
      inLevel2 = true;
      displayResultMessage("you reached level 2", 4000);
      level2El.style.display = "block";
      gameAreaEl.style.display = "none";
    } else {
      setTimeout(function () {
        window.location.reload();
      }, 4000);
    }
  } else if (inLevel2) {
    if (winningGames > 3) {
      inLevel2 = false;
      inLevel3 = true;
      displayResultMessage("you reached the final level", 4000);
      level3El.style.display = "block";
      gameAreaEl.style.display = "none";
    } else {
      setTimeout(function () {
        window.location.reload();
      }, 4000);
    }
  } else if (inLevel3) {
    if (winningGames > 4) {
      inLevel3 = false;
      displayResultMessage("Congratulations, you won the game", 6000);
      setTimeout(function () {
        window.location.reload();
      }, 6000);
    } else {
      setTimeout(function () {
        window.location.reload();
      }, 4000);
    }
  }
}

function displayResultMessage(text, time = 1000) {
  document.getElementById("result-message").textContent = `${text}`;
  document.getElementById("result-message").style.display = "inline";
  setTimeout(function () {
    document.getElementById("result-message").style.display = "none";
  }, time);
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
