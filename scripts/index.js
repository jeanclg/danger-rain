// instanciando o canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let frame = 0;

// variável global auxiliar para ter acesso aos objetos criados em outras funções
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

function createPlayer() {
  const player = {
    x: canvas.width / 2 - 16,
    y: canvas.height - 182,
    width: 32,
    height: 32,
    color: "red",
    speed: 3,
    direction: "D",
    draw() {
      ctx.fillStyle = "green";
      ctx.fillRect(player.x, player.y, player.width, player.height);
    },
    update() {
      this.movePlayer();
      this.checkWall();
    },
    click() {
      this.changeDirection();
    },
    movePlayer() {
      if (player.direction === "D") {
        player.x += player.speed;
      } else if (player.direction === "E") {
        player.x -= player.speed;
      }
    },
    changeDirection() {
      if (player.direction === "D") player.direction = "E";
      else if (player.direction === "E") player.direction = "D";
    },
    checkWall() {
      if (player.x + player.width >= canvas.width) player.direction = "E";
      if (player.x <= 0) player.direction = "D";
    },
  };
  return player;
}

function createEnemy() {
  const enemy = {
    x: 100,
    y: 40,
    width: 10,
    height: 40,
    color: "red",
    gravity: 8,
    spawnEnemy: [],
    collisionCheck(obj) {
      return !(
        enemy.y + enemy.height < obj.y ||
        enemy.y > obj.y + obj.height ||
        enemy.x + enemy.width < obj.x ||
        enemy.x > obj.x + obj.width
      );
    },
    draw() {
      enemy.spawnEnemy.forEach((i) => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(i.x, i.y, enemy.width, enemy.height);
      });
    },
    update() {
      // a cada x tempo instancia um novo inimigo numa posição random em X
      const intervalFrame = frame % 60 === 0;
      if (intervalFrame) {
        enemy.spawnEnemy.push({
          x: Math.floor(Math.random() * canvas.width) + 10,
          y: -40,
        });
      }
      // aplica a gravidade para cada inimigo criado
      enemy.spawnEnemy.forEach((i) => {
        i.y += enemy.gravity;
        // verifica se o inimigo colide com o chão, se sim ele é deletado e aumenta o score
        if (i.y + enemy.height >= floor.y) {
          enemy.spawnEnemy.shift();
          globalAux.score.score++;
        }
        // verifica a colisão do inimigo com o jogador, se sim vai para tela de game over
        if (
          i.y + enemy.height < globalAux.player.y + 5 ||
          i.x + enemy.width < globalAux.player.x + 5 ||
          i.x > globalAux.player.x + globalAux.player.width - 5
        ) {
        } else {
          changeScreen(screen.GAMEOVER);
        }
      });
    },
  };
  return enemy;
}

const bcg = {
  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },
};

const floor = {
  x: 0,
  y: canvas.height - 150,
  width: canvas.width,
  height: 150,
  color: "black",
  draw() {
    ctx.fillStyle = floor.color;
    ctx.fillRect(floor.x, floor.y, floor.width, floor.height);
  },
};

// declarando o score
function createScore() {
  const scoreGame = {
    score: 0,
    draw() {
      ctx.font = "50px Verdana";
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.fillText(scoreGame.score, canvas.width / 2, 60);
    },
    update() {},
  };
  return scoreGame;
}

function createGameOverScreen() {
  const gameOverScreen = {
    draw() {
      ctx.font = "35px Verdana";
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
      ctx.fillText(
        `Score: ${globalAux.score.score}`,
        canvas.width / 2,
        canvas.height / 2 + 40
      );
    },
    update() {},
    click() {
      changeScreen(screen.START);
    },
  };
  return gameOverScreen;
}

// objeto que guarda todas as telas do jogo
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
      globalAux.enemy = createEnemy();
      globalAux.score = createScore();
    },
    draw() {
      bcg.draw();
      globalAux.player.draw();
      globalAux.enemy.draw();
      globalAux.score.draw();
      floor.draw();
    },
    update() {
      globalAux.player.update();
      globalAux.enemy.update();
      globalAux.score.update();
    },
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

// função que atualiza os frames da tela a cada instante
function loop() {
  currentScreen.draw();
  currentScreen.update();
  frame++;
  requestAnimationFrame(loop);
}

// inicia o jogo
changeScreen(screen.START);
loop();
