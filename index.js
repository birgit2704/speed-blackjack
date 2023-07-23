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
let ofGames;
let inLevel1 = true;
let inLevel2 = false;
let inLevel3 = false;
let earlyEnd = false;
let timer;
let remainingCardsInDeck = 52;
let deductAce1 = 0;
let deductAce2 = 0;
let deductAce3 = 0;
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

document.getElementById("rules").addEventListener("click", () => {
  document.getElementById("rules-modal").style.display = "block";
});
document.getElementById("close-rules-btn").addEventListener("click", () => {
  document.getElementById("rules-modal").style.display = "none";
});
startBtn.addEventListener("click", startBlackjack);
playerStartBtn.addEventListener("click", startGame);
noNewCardBtn.addEventListener("click", endGame);
newCardBtn.addEventListener("click", () => {
  getCards(1, "player");
  remainingCardsInDeck -= 1;
});
level1Btn.addEventListener("click", startLevel);
level2Btn.addEventListener("click", startLevel);
level3Btn.addEventListener("click", startLevel);

function startBlackjack() {
  document.getElementById("header").style.display = "none";
  startBtn.style.display = "none";
  level1El.style.display = "block";
}

function startLevel() {
  if (inLevel2) {
    document.getElementById("level").textContent = "Level 2";
  }
  if (inLevel3) {
    document.getElementById("level").textContent = "Level 3";
  }
  winningGames = 0;
  ofGames = inLevel1 ? 4 : inLevel2 ? 5 : 6;
  remainingCardsInDeck = 52;
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
  startAndEndTimer();
  updateRemainingCards();
}

function startGame() {
  remainingCardsInDeck -= 4;
  playerStartBtn.disabled = true;
  playerScore = 0;
  dealerScore = 0;
  deductAce1 = 0;
  deductAce2 = 0;
  deductAce3 = 0;
  getCards(2, "dealer");
  getCards(2, "player");
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

function updateRemainingCards() {
  if (remainingCardsInDeck < 0) {
    remainingCardsInDeck = 0;
  }
  document.getElementById(
    "cards-remaining"
  ).textContent = `Cards remaining: ${remainingCardsInDeck}`;
  if (remainingCardsInDeck < 1) {
    displayResultMessage("no more cards left", 1500);
    playerStartBtn.style.display = "none";
    newCardBtn.style.display = "none";
    noNewCardBtn.style.display = "none";
    setTimeout(continueNextLevel, 500);
  }
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

        // Treat ACE either as 1 or 11
        if (num === 1 && data.cards[0].value === "ACE") {
          deductAce3 = 10;
          console.log("deduct3", deductAce3);
        }
      }
      renderCards(num, player, cardsHtml, data);
      updateRemainingCards();
    });
}

function renderCards(num, player, cardsHtml, data) {
  if (num == 1) {
    document.getElementById(`${player}-cards`).innerHTML += cardsHtml;
    determineWinner(player, data);
  } else {
    document.getElementById(`${player}-cards`).innerHTML = cardsHtml;
    determineWinner(player, data, num);
  }
}

function determineWinner(player, data, num) {
  if (player === "player") {
    if (data.cards.map((el) => el.value).includes("ACE"));
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

  // treat ACE either as 1 or as 11
  if (player === "player" && num === 2 && data.cards[0].value === "ACE") {
    deductAce1 = 10;
  }
  if (player === "player" && num === 2 && data.cards[1].value === "ACE") {
    deductAce2 = 10;
  }

  if (playerScore > 21 && (deductAce1 || deductAce2 || deductAce3)) {
    if (deductAce1) {
      playerScore -= deductAce1;
      deductAce1 = 0;
    }
    if (deductAce2) {
      playerScore -= deductAce2;
      deductAce2 = 0;
    }
    if (deductAce3) {
      playerScore -= deductAce3;
      deductAce3 = 0;
    }
  }

  if (playerScore < 22) {
    newCardBtn.disabled = false;
    noNewCardBtn.disabled = false;
  } else endGame();

  console.log("deduct1", deductAce1);
  console.log("deduct2", deductAce2);
  console.log("deduct3", deductAce3);
  console.log(playerScore);
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
  aceInCards = false;
  anotherAceInCards = false;
}

function renderWinningGames() {
  winningGames += 1;

  document.getElementById(
    "score"
  ).textContent = `Games won: ${winningGames} of ${ofGames}`;
  checkGame();
}

function checkGame() {
  if (inLevel1 && winningGames === 4) {
    playerStartBtn.disabled === true;
    earlyEnd = true;
    continueNextLevel();
  }
  if (inLevel2 && winningGames === 5) {
    playerStartBtn.disabled === true;
    earlyEnd = true;
    continueNextLevel();
  }
  if (inLevel3 && winningGames === 6) {
    playerStartBtn.disabled === true;
    earlyEnd = true;
    continueNextLevel();
  }
}

function continueNextLevel() {
  if (inLevel1) {
    if (winningGames > 3) {
      inLevel1 = false;
      inLevel2 = true;
      setTimeout(function () {
        displayResultMessage("you reached level 2", 4000);
        level2El.style.display = "block";
        gameAreaEl.style.display = "none";
      }, 2000);
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 4000);
    }
  } else if (inLevel2) {
    if (winningGames > 4) {
      inLevel2 = false;
      inLevel3 = true;
      setTimeout(function () {
        displayResultMessage("you reached the final level", 4000);
        level3El.style.display = "block";
        gameAreaEl.style.display = "none";
      }, 2000);
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  } else if (inLevel3) {
    if (winningGames > 6) {
      inLevel3 = false;
      setTimeout(function () {
        displayResultMessage("Congratulations, you won the game", 6000);
        playerStartBtn.style.display = "none";
        newCardBtn.style.display = "none";
        noNewCardBtn.style.display = "none";
        setTimeout(() => {
          window.location.reload();
        }, 6000);
      }, 2000);
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 4000);
    }
  }
}

function displayResultMessage(text, time = 1000) {
  document.getElementById("result-message").textContent = `${text}`;
  document.getElementById("result-message").style.display = "inline";
  setTimeout(() => {
    document.getElementById("result-message").style.display = "none";
  }, time);
}

function startAndEndTimer() {
  timerEl.style.display = "block";

  document.getElementById("score").textContent = `Games won: 0 of 4`;

  getDeck();
  if (inLevel1) startCountdown();
  else if (inLevel2 || (inLevel3 && earlyEnd === true)) {
    setTimeout(() => {
      earlyEnd = false;
      startCountdown();
    }, 500);
  }
}

function startCountdown() {
  let count = 60;
  let timer = setInterval(() => {
    document.getElementById("countdown").innerHTML = count--;
    if (earlyEnd) clearInterval(timer);
    if (count === -1) {
      clearInterval(timer);
      newCardBtn.disabled = true;
      noNewCardBtn.disabled = true;
      playerStartBtn.disabled = true;
      displayResultMessage("time is up", 4000);
      playerStartBtn.style.display = "none";
      newCardBtn.style.display = "none";
      noNewCardBtn.style.display = "none";
      continueNextLevel();
    }
  }, 1000);
}

// text effect typewriter on initial page
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
