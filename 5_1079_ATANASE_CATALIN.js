const gameContainer = document.querySelector(".gameContainer");
const entryContainer = document.querySelector(".entry-container");
const startGameBtn = document.querySelector("#startGameBtn");
const playerName = document.querySelector("#playerName");
const playAgain = document.querySelector("#playAgain");
const scoresContainer = document.querySelector(".scores");

let scores;

const ASTEROID_MAX_HP = 4;
const FRAMES = 1000 / 60;

let canvas, canvasContext, canvasWidth, canvasHeight;
let asteroids = [];
let asteroidYSpeed = 0,
  asteroidXSpeed = 0;
let asteroidWidth, asteroidHeight, asteroidRadius;
let shipLeftX = 400,
  shipLeftY = 550;
let shipRightX = 450,
  shipRightY = 550;
let shipTopX = 425,
  shipTopY = 500;
let shipSpeed = 5;
let shipHP = 3;
let isShipImmune = false;

let rocketX = 425,
  rocketY = 500;
let rocketSpeed = 20;

let score = 0;
let isMovingRocket;

let isDone;

const drawAsteroid = (asteroid) => {
  canvasContext.beginPath();
  if (asteroid.hp === 1) {
    canvasContext.fillStyle = "green";
  }
  if (asteroid.hp === 2) {
    canvasContext.fillStyle = "yellow";
  }
  if (asteroid.hp === 3) {
    canvasContext.fillStyle = "orange";
  }
  if (asteroid.hp === 4) {
    canvasContext.fillStyle = "red";
  }

  if (asteroid.hp > 0) {
    canvasContext.arc(asteroid.x, asteroid.y, asteroid.radius, 0, 2 * Math.PI);
    canvasContext.fill();
    canvasContext.beginPath();
    canvasContext.fillStyle = "black";
    canvasContext.font = "bold 12px Tahoma";
    canvasContext.textBaseline = "middle";
    canvasContext.textAlign = "center";
    canvasContext.fillText(asteroid.hp, asteroid.x, asteroid.y);
  }
};

const placeRocket = () => {
  rocketX = shipTopX;
  rocketY = shipTopY;
};

const clearisMovingRocket = () => {
  clearInterval(isMovingRocket);
  isMovingRocket = null;
};

const checkRocketColision = (asteroid) => {
  let distanta = Math.sqrt(
    (rocketX - asteroid.x) * (rocketX - asteroid.x) +
      (rocketY - asteroid.y) * (rocketY - asteroid.y)
  );
  if (distanta < asteroid.radius && asteroid.hp > 0 && isMovingRocket) {
    placeRocket();
    asteroid.hp--;
    asteroid.radius = asteroid.hp * asteroidRadius;
    ASTEROID_FUNCTIONS.setAsteroidSpeed(asteroid)
    if (asteroid.hp < 1) {
      asteroids = asteroids.filter((a) => a.id !== asteroid.id);
    }
    score++;
    if (score % 5 === 0) {
      shipHP++;
    }
    clearisMovingRocket();
  }
};

const checkShipCollision = (asteroid) => {
  let topDistance = Math.sqrt(
    (shipTopX - asteroid.x) * (shipTopX - asteroid.x) +
      (shipTopY - asteroid.y) * (shipTopY - asteroid.y)
  );

  let leftDistance = Math.sqrt(
    (shipLeftX - asteroid.x) * (shipLeftX - asteroid.x) +
      (shipLeftY - asteroid.y) * (shipLeftY - asteroid.y)
  );

  let rightDistance = Math.sqrt(
    (shipRightX - asteroid.x) * (shipRightX - asteroid.x) +
      (shipRightY - asteroid.y) * (shipRightY - asteroid.y)
  );
  if (
    (rightDistance < asteroid.radius ||
      leftDistance < asteroid.radius ||
      topDistance < asteroid.radius) &&
    !isShipImmune
  ) {
    shipHP--;
    isShipImmune = true;
    setTimeout(() => {
      isShipImmune = false;
    }, 750);
  }
};

const shipCollision = () => {
  if (shipHP > 0) {
    asteroids.forEach(ASTEROID_FUNCTIONS.checkShipCollision);
  }
};

const moveAsteroid = (asteroid) => {
  if (asteroid.y + asteroid.ySpeed >= canvasHeight || asteroid.y < 0) {
    asteroid.ySpeed = -asteroid.ySpeed;
  }
  asteroid.y += asteroid.ySpeed;
  if (asteroid.x + asteroid.xSpeed >= canvasWidth || asteroid.x < 0) {
    asteroid.xSpeed = -asteroid.xSpeed;
  }
  asteroid.x += asteroid.xSpeed;
  shipCollision();
};

const setAsteroidSpeed = (asteroid) => {
  asteroid.xSpeed = Math.min(5, asteroidXSpeed * (ASTEROID_MAX_HP - asteroid.hp + 1));
  asteroid.ySpeed = Math.min(5, asteroidYSpeed * (ASTEROID_MAX_HP - asteroid.hp + 1));
};

const ASTEROID_FUNCTIONS = {
  drawAsteroid,
  checkRocketColision,
  checkShipCollision,
  moveAsteroid,
  setAsteroidSpeed,
};

const drawShip = () => {
  canvasContext.fillStyle = isShipImmune ? "#4FF0FF" : "#0099e5";
  canvasContext.moveTo(shipRightX, shipRightY);
  canvasContext.lineTo(shipLeftX, shipLeftY);
  canvasContext.lineTo(shipTopX, shipTopY);
  canvasContext.fill();
};

const drawRocket = () => {
  canvasContext.beginPath();
  canvasContext.fillStyle = "red";
  if (rocketY < 0 || !isMovingRocket) {
    clearisMovingRocket();
    placeRocket();
  }
  canvasContext.arc(rocketX, rocketY, 5, 0, 2 * Math.PI);
  canvasContext.fill();
};

const drawShipHp = () => {
  canvasContext.beginPath();
  canvasContext.fillStyle = "white";
  canvasContext.font = "bold 20pt Arial";
  canvasContext.textAlign = "left";
  canvasContext.fillText(`Mai ai ${shipHP} vieti`, 50, 50);
};

const drawScore = () => {
  canvasContext.beginPath();
  canvasContext.fillStyle = "white";
  canvasContext.font = "bold 20pt Arial";
  canvasContext.textAlign = "left";
  canvasContext.fillText(`Scor: ${score}`, 550, 50);
};

const checkEndGame = () => {
  if (shipHP === 0 || asteroids.length === 0) {
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    canvasContext.beginPath();
    canvasContext.fillStyle = "white";
    canvasContext.font = "bold 40pt Arial";
    canvasContext.textAlign = "middle";
    canvasContext.fillText(`Game over! Scor: ${score}`, 150, 300);
    localStorage.setItem(
      "scores",
      JSON.stringify([...scores, { name: playerName.value, score }])
    );
    return true;
  }
  return false;
};

const checkNeedToMoveRocket = () => {
  return rocketX === shipTopX && rocketY === shipTopY;
};

const drawCanvas = () => {
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

  //desenare asteroizi
  asteroids.forEach(ASTEROID_FUNCTIONS.drawAsteroid);

  //desenare nava in functie de dimensiunile canvas-ului
  drawShip();

  //desenare racheta
  drawRocket();

  //desenare numar vieti
  drawShipHp();

  //desenare scor
  drawScore();

  //Sfarsit joc!!!!
  isDone = checkEndGame();

  //programare executie
  if (!isDone) {
    requestAnimationFrame(drawCanvas);
  }
};

const onFrameMove = () => {
  asteroids.forEach(ASTEROID_FUNCTIONS.moveAsteroid);
};
//Miscare nava
const moveShip = (e) => {
  if (e.keyCode === 37 && shipLeftX >= 0) {
    shipRightX -= shipSpeed;
    shipLeftX -= shipSpeed;
    shipTopX -= shipSpeed;
  }
  if (e.keyCode === 39 && shipRightX <= canvasWidth) {
    shipRightX += shipSpeed;
    shipLeftX += shipSpeed;
    shipTopX += shipSpeed;
  }
  if (e.keyCode === 38 && shipTopY >= 0) {
    shipRightY -= shipSpeed;
    shipLeftY -= shipSpeed;
    shipTopY -= shipSpeed;
  }
  if (
    e.keyCode === 40 &&
    shipLeftY <= 600
  ) {
    shipRightY += shipSpeed;
    shipLeftY += shipSpeed;
    shipTopY += shipSpeed;
  }
  if (e.keyCode === 88) {
    if (!isMovingRocket) {
      isMovingRocket = setInterval(() => {
        rocketY -= rocketSpeed;
      }, FRAMES);
    }
  }

  if (checkNeedToMoveRocket()) {
    drawRocket();
  }
};

const rocketAsteroidCollision = () => {
  if(asteroids.length === 0) {
    canvasContext.fillText(`Game over! Scor: ${score}`, 150, 300);
  }
  asteroids.forEach(ASTEROID_FUNCTIONS.checkRocketColision);
};

const showScores = () => {
  scoresContainer.textContent = "";
  scores = JSON.parse(localStorage.getItem("scores"));
  if (scores) {
    scores.sort((a, b) => b.score - a.score);
    scores.forEach((value) => {
      const p = document.createElement("p");
      p.textContent = `${value.name} - ${value.score}`;
      scoresContainer.appendChild(p);
    });
  } else {
    scores = [];
  }
};

const setup = () => {
  score = 0;
  shipHP = 3;
  (shipLeftX = 400), (shipLeftY = 550);
  (shipRightX = 450), (shipRightY = 550);
  (shipTopX = 425), (shipTopY = 500);
  shipSpeed = 5;
  shipHP = 3;
  isShipImmune = false;
  (rocketX = 425), (rocketY = 500);
  asteroids = [];
};

const app = () => {
  showScores();
  setup();
  canvas = document.querySelector("#gameCanvas");
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  canvasContext = canvas.getContext("2d");

  const counter = 8;
  let hp;
  asteroidWidth = canvasWidth / counter;
  asteroidHeight = canvasHeight / counter;
  asteroidRadius = canvasHeight / 40;
  asteroidYSpeed = Math.random() * 2;
  asteroidXSpeed = Math.random();

  let k = 1;
  for (let i = 0; i < counter; i++) {
    if (k <= ASTEROID_MAX_HP) {
      hp = Math.ceil(Math.random() * ASTEROID_MAX_HP)
      asteroids.push({
        id: i,
        x: k * asteroidWidth + Math.random() * 150,
        y: k * asteroidHeight + Math.random() * 20,
        radius: asteroidRadius * hp,
        hp
      });
      k++;
    } else {
      k = 1;
    }
  }
  asteroids.forEach(ASTEROID_FUNCTIONS.setAsteroidSpeed)
  drawCanvas();
  setInterval(onFrameMove, FRAMES);
  document.addEventListener("keydown", moveShip);
  setInterval(rocketAsteroidCollision, FRAMES);
};

document.addEventListener("DOMContentLoaded", showScores);

startGameBtn.addEventListener("click", () => {
  if (playerName.value.trim() != "") {
    gameContainer.style.display = "flex";
    entryContainer.style.display = "none";
    app();
  }
});

playAgain.addEventListener("click", (e) => {
  gameContainer.style.display = "none";
  entryContainer.style.display = "flex";
  showScores();
});
