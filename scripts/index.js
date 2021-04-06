// instanciando o canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// musica de fundo do jogo
const gameMusic = new Audio();
gameMusic.src = "/assets/sounds/bensound-dreams.mp3";
gameMusic.volume = 0.15;

// variavel para saber o frame atual do jogo
let frame = 0;

// variável global auxiliar para ter acesso aos objetos criados em outras funções
const globalAux = {};

// função que controla a dificuldade do jogo
function createDifficulty() {
  const dif = {
    interval: 60, // dificuldade fácil
    checkInterval() {
      if (frame > 500 && frame < 1000) dif.interval = 40; // dificuldade média
      if (frame > 1000) dif.interval = 20; // dificuldade dificil
    },
    update() {
      this.checkInterval();
    },
  };
  return dif;
}

// tela de inicio
function createTitleScreen() {
  const titleScreen = {
    draw() {
      ctx.font = "28px Montserrat";
      ctx.textAlign = "center";
      ctx.fillStyle = "#eeeeee";
      ctx.fillText("CLICK TO CHANGE", canvas.width / 2, canvas.height / 2 - 50);
      ctx.fillText(
        "PLAYER DIRECTION",
        canvas.width / 2,
        canvas.height / 2 - 10
      );
      ctx.font = "20px Montserrat";
      ctx.fillText(
        "CLICK TO START",
        canvas.width / 2,
        canvas.height / 2 - 10 + 200
      );
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
    color: "#00adb5",
    speed: 3,
    direction: "D",
    draw() {
      ctx.fillStyle = player.color;
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
    // determina a direção que o player irá se mover
    changeDirection() {
      if (player.direction === "D") player.direction = "E";
      else if (player.direction === "E") player.direction = "D";
    },
    // verifica se há colisão com as paredes do canvas, se sim inverte sua direção
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
    color: "#eeeeee",
    gravity: 0.3,
    speed: 0,
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
      const intervalFrame = frame % globalAux.difficulty.interval === 0;
      if (intervalFrame) {
        enemy.spawnEnemy.push({
          x: Math.floor(
            Math.random() * (canvas.width - enemy.width - enemy.width + 1) +
              enemy.width
          ),
          y: -40,
          speed: 0,
        });
      }
      // aplica a gravidade para cada inimigo criado
      enemy.spawnEnemy.forEach((i) => {
        i.speed += enemy.gravity;
        i.y += i.speed;
        // i.y += enemy.gravity;
        // verifica se o inimigo colide com o chão, se sim ele é deletado e aumenta o score
        if (i.y + enemy.height >= floor.y + 10) {
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

// background
const bcg = {
  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#393e46";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  },
};

const floor = {
  x: 0,
  y: canvas.height - 150,
  width: canvas.width,
  height: 150,
  color: "#222831",
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
      ctx.font = "50px Montserrat";
      ctx.textAlign = "center";
      ctx.fillStyle = "#eeeeee";
      ctx.fillText(scoreGame.score, canvas.width / 2, 60);
    },
    update() {},
  };
  return scoreGame;
}

// tela de game over
function createGameOverScreen() {
  const gameOverScreen = {
    draw() {
      ctx.font = "35px Montserrat";
      ctx.textAlign = "center";
      ctx.fillStyle = "#eeeeee";
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
      gameMusic.play();
      frame = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // limpando a tela quando iniciado o jogo
      globalAux.difficulty = createDifficulty();
      globalAux.player = createPlayer();
      globalAux.enemy = createEnemy();
      globalAux.score = createScore();
      bcg.begin();
    },
    draw() {
      bcg.draw();
      globalAux.difficulty.update();
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
      gameMusic.pause(); // parando o som quando chega na tela de game over
      gameMusic.currentTime = 0; // resetando o som para começar do início quando reiniciado o jogo
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

// evento de clique que se adequa a cada tela
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
