const startBtn = document.getElementById("start-btn");

startBtn.addEventListener("click", handleStartGame);

function handleStartGame() {
  document.getElementById("header").style.display = "none";
  startBtn.style.display = "none";
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
