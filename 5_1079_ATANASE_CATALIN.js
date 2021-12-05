let canvas, canvasContext, canvasWidth, canvasHeight;
let asteroids = [];
let asteroidYSpeed = 0,
  asteroidXSpeed = 0;
let asteroidWidth, asteroidHeight, asteroidRadius;
/*     
             COORDONATE NAVA
             3 score:
             dreapta (400,550) (shipLeftX,shipLeftY)
             stanga(450, 550) (shipRightX, shipRightY)
             sus(425, 500)    (shipTopX, yNava Sus)
     */

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
const frames = 1000 / 60;

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
    canvasContext.arc(
      asteroid.x,
      asteroid.y,
      asteroid.hp * asteroid.radius,
      0,
      2 * Math.PI
    );
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
    if (asteroid.hp < 1) {
      asteroids = asteroids.filter((a) => a.id !== asteroid.id);
    }
    score++;
    if(score % 5 === 0) {
      shipHP++;
    }
    clearisMovingRocket();
  }
};

const checkShipCollision = (asteroid) => {
  //distanta dintre asteroid si punctul de sus
  let topDistance = Math.sqrt(
    (shipTopX - asteroid.x) * (shipTopX - asteroid.x) +
      (shipTopY - asteroid.y) * (shipTopY - asteroid.y)
  );

  //distanta dintre asteroid si punctul din stanga
  let leftDistance = Math.sqrt(
    (shipLeftX - asteroid.x) * (shipLeftX - asteroid.x) +
      (shipLeftY - asteroid.y) * (shipLeftY - asteroid.y)
  );

  //distanta dintre asteroid si punctul din dreapta
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
  if (asteroid.y + asteroidYSpeed >= canvasHeight || asteroid.y < 0) {
    asteroidYSpeed = -asteroidYSpeed;
  }
  asteroid.y += asteroidYSpeed;
  if (asteroid.x + asteroidXSpeed >= canvasWidth || asteroid.x < 0) {
    asteroidXSpeed = -asteroidXSpeed;
  }
  asteroid.x += asteroidXSpeed;
  shipCollision();
};

const ASTEROID_FUNCTIONS = {
  drawAsteroid,
  checkRocketColision,
  checkShipCollision,
  moveAsteroid,
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
  if (shipHP === 0) {
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    canvasContext.beginPath();
    canvasContext.fillStyle = "white";
    canvasContext.font = "bold 40pt Arial";
    canvasContext.textAlign = "middle";
    canvasContext.fillText(`Game over! Scor: ${score}`, 150, 300);
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
  //stanga
  if (e.keyCode === 37 && shipLeftX >= 0) {
    shipRightX -= shipSpeed;
    shipLeftX -= shipSpeed;
    shipTopX -= shipSpeed;
  }
  //dreapta
  if (e.keyCode === 39 && shipRightX <= canvasWidth) {
    shipRightX += shipSpeed;
    shipLeftX += shipSpeed;
    shipTopX += shipSpeed;
  }
  //sus
  if (e.keyCode === 38 && shipTopY >= 0) {
    shipRightY -= shipSpeed;
    shipLeftY -= shipSpeed;
    shipTopY -= shipSpeed;
  }
  //jos
  if (
    e.keyCode === 40 &&
    shipLeftY <= 550 /*Nu las nava mai jos decat pozitia initiala*/
  ) {
    shipRightY += shipSpeed;
    shipLeftY += shipSpeed;
    shipTopY += shipSpeed;
  }
  //X->lansez rachete
  if (e.keyCode === 88) {
    if (!isMovingRocket) {
      isMovingRocket = setInterval(() => {
        rocketY -= rocketSpeed;
      }, frames);
    }
  }

  if (checkNeedToMoveRocket()) {
    drawRocket();
  }
};

const rocketAsteroidCollision = () => {
  asteroids.forEach(ASTEROID_FUNCTIONS.checkRocketColision);
};

const app = () => {
  canvas = document.querySelector("#gameCanvas");
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  canvasContext = canvas.getContext("2d");

  const counter = 5;
  asteroidWidth = canvasWidth / counter;
  asteroidHeight = canvasHeight / counter;
  asteroidRadius = canvasHeight / 40;
  asteroidYSpeed = Math.random() * 2;
  asteroidXSpeed = Math.random() * 2;

  let k = 1;
  for (let i = 0; i < counter; i++) {
    if (k <= 4) {
      asteroids.push({
        id: i,
        x: k * asteroidWidth + Math.random() * 150,
        y: k * asteroidHeight + Math.random() * 150,
        radius: asteroidRadius,
        hp: k,
      });
      k++;
    } else {
      k = 1;
    }
  }
  drawCanvas();
  setInterval(onFrameMove, frames);
  document.addEventListener("keydown", moveShip);
  setInterval(rocketAsteroidCollision, frames);
};

document.addEventListener("DOMContentLoaded", app);
