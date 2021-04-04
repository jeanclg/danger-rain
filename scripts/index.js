const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const globalAux = {};

function createTitleScreen() {
  const titleScreen = {
    draw() {
      ctx.font = "35px Verdana";
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.fillText("TAP TO START", canvas.width / 2, canvas.height / 2);
    },
    update() {},
  };
  return titleScreen;
}

function createGameOverScreen() {
  const gameOverScreen = {
    draw() {
      ctx.font = "35px Verdana";
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    },
    update() {},
    click() {
      changeScreen(screen.START);
    },
  };
  return gameOverScreen;
}

function createPlayer() {
  const player = {
    x: canvas.width / 2 - 16,
    y: canvas.height - 182,
    width: 32,
    height: 32,
    color: "red",
    draw() {
      ctx.fillStyle = "green";
      ctx.fillRect(player.x, player.y, player.width, player.height);
    },
    update() {},
    click() {
      changeScreen(screen.GAMEOVER);
    },
  };
  return player;
}

const floor = {
  x: 0,
  y: canvas.height - 150,
  width: canvas.width,
  height: 150,
  color: "black",
  draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(floor.x, floor.y, floor.width, floor.height);
  },
};

const screen = {
  START: {
    begin() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // limpando a tela quando iniciado o jogo
      globalAux.startScreen = createTitleScreen();
    },
    draw() {
      globalAux.startScreen.draw();
    },
    update() {},
    click() {
      changeScreen(screen.GAME);
    },
  },
  GAME: {
    begin() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // limpando a tela quando iniciado o jogo
      globalAux.player = createPlayer();
    },
    draw() {
      globalAux.player.draw();
      floor.draw();
    },
    update() {},
    click() {
      globalAux.player.click();
    },
  },
  GAMEOVER: {
    begin() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // limpando a tela quando iniciado o jogo
      globalAux.gameOver = createGameOverScreen();
    },
    draw() {
      globalAux.gameOver.draw();
    },
    update() {},
    click() {
      globalAux.gameOver.click();
    },
  },
};

window.addEventListener("click", () => {
  if (currentScreen.click) currentScreen.click();
});

// declarando a tela corrente que irá estar na tela do jogador
let currentScreen = {};

// função que altera a tela do jogador Ex: tela inicial para tela do jogo.
function changeScreen(newScreen) {
  currentScreen = newScreen;
  if (currentScreen.begin) currentScreen.begin();
}

function loop() {
  currentScreen.draw();
  currentScreen.update();
  requestAnimationFrame(loop);
}

changeScreen(screen.START);
loop();
