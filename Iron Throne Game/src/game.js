'use strict';

import rollADie from 'roll-a-die';

class Game {
  constructor(canvas, characters) {
    const _this = this;

    this.characters = characters;
    this.frameCounter = 0;
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.winningRoll = 30;

    this.timer = null;

    this.dice = document.getElementById('dice');
    this.game = document.getElementById('game');
    this.winner = document.getElementById('winner');
    this.notifications = document.querySelector('#notifications ul');

    const board = [{
        position: 1,
        x: 4,
        y: 0
      },
      {
        position: 2,
        x: 4,
        y: 1
      },
      {
        position: 3,
        x: 4,
        y: 2
      },
      {
        position: 4,
        x: 4,
        y: 3
      },
      {
        position: 5,
        x: 4,
        y: 4
      },
      {
        position: 6,
        x: 4,
        y: 5
      },
      {
        position: 7,
        x: 3,
        y: 5
      },
      {
        position: 8,
        x: 3,
        y: 4
      },
      {
        position: 9,
        x: 3,
        y: 3
      },
      {
        position: 10,
        x: 3,
        y: 2
      },
      {
        position: 11,
        x: 3,
        y: 1
      },
      {
        position: 12,
        x: 3,
        y: 0
      },
      {
        position: 13,
        x: 2,
        y: 0
      },
      {
        position: 14,
        x: 2,
        y: 1
      },
      {
        position: 15,
        x: 2,
        y: 2
      },
      {
        position: 16,
        x: 2,
        y: 3
      },
      {
        position: 17,
        x: 2,
        y: 4
      },
      {
        position: 18,
        x: 2,
        y: 5
      },
      {
        position: 19,
        x: 1,
        y: 5
      },
      {
        position: 20,
        x: 1,
        y: 4
      },
      {
        position: 21,
        x: 1,
        y: 3
      },
      {
        position: 22,
        x: 1,
        y: 2
      },
      {
        position: 23,
        x: 1,
        y: 1
      },
      {
        position: 24,
        x: 1,
        y: 0
      },
      {
        position: 25,
        x: 0,
        y: 0
      },
      {
        position: 26,
        x: 0,
        y: 1
      },
      {
        position: 27,
        x: 0,
        y: 2
      },
      {
        position: 28,
        x: 0,
        y: 3
      },
      {
        position: 29,
        x: 0,
        y: 4
      },
      {
        position: 30,
        x: 0,
        y: 5
      },
    ];

    const getPosition = (pos) => {
      const result = board.filter(item => item.position == pos);

      const position = {
        step: 1,
        x: result[0].x,
        y: result[0].y,
      };

      return position;
    };

    const numbers = [ ...Array(6).keys() ].map(num => num + 1);
    numbers.sort(() => Math.random() - 0.5);

    const player1image = `assets/icons/${numbers.slice(0, 1)}.png`;
    const player2image = `assets/icons/${numbers.slice(1, 2)}.png`;

    this.state = {
      board,
      roll: 0,
      currentPlayer: 0,
      players: [{
          name: 'Jan Terje',
          position: getPosition(1),
          color: 'red',
          icon: {
            src: '',
            size: {
              width: 305,
              height: 290
            }
          }
        },
        {
          name: 'Scott',
          position: getPosition(1),
          color: 'blue',
          src: '',
          size: {
            width: 305,
            height: 290
          }
        }
      ],
      traps: [{
          type: 0,
          position: getPosition(5),
        },
        {
          type: 1,
          position: getPosition(11),
        },
        {
          type: 1,
          position: getPosition(16),
        },
        {
          type: 0,
          position: getPosition(24),
        },
        {
          type: 0,
          position: getPosition(28),
        },
      ]
    };

    this.bg = new Image();
    this.bg.src = 'assets/img/board-grid.jpg';

    this.player1icon = new Image();
    this.player1icon.src = player1image;

    this.player2icon = new Image();
    this.player2icon.src = player2image;

    this.trapicon = new Image();
    this.trapicon.src = 'assets/img/dragontrap.png';

    document.addEventListener('click', function(e) {
      if (!event.target.matches('.roll')) {
        return;
      }

      e.preventDefault();

      _this.roll();

    }, false);

    const winner = (player, name) => {
      const el = document.querySelector('.winner-inner .winner-back');
      const displayName = document.createElement('div');
      displayName.innerHTML = `<h2>Winner!</h2><h3>(Player ${player}) ${name}</h3>`;
      el.append(displayName);

      this.game.style.display = 'none';
      this.winner.style.display = 'block';

      setTimeout(() => {
        const el = document.querySelector('.winner-inner');
        el.setAttribute('class', 'winner-inner flipped');
      }, 2000);
    };

    const winState = (event) => {
      const player = event.data.player ? event.data.player : '';
      const name = event.data.name ? event.data.name : '';
      const audio = new Audio('assets/theme-cover.mp3');
      audio.play();
      setTimeout(() => winner(player, name), 1000);
    };

    window.addEventListener('winGame', winState);

    setTimeout(() => this.init(), 500);

    // this.trackWindowSize();
  }

  init() {
    this.drawAll();
  }

  addNotification(text) {
    const notification = document.createElement('li');
    notification.innerHTML = text;
    this.notifications.appendChild(notification);

    this.notifications.scrollTop = this.notifications.scrollHeight - this.notifications.clientHeight;
  }

  roll() {
    const _this = this;

    const callback = (roll) => {
      let currentPlayer = this.state.currentPlayer;
      let current = this.state.players[currentPlayer].position.step;

      const player = currentPlayer + 1;
      const name = this.characters[currentPlayer];

      let newPosition = this.calculatePosition(current, roll);

      if (newPosition >= this.winningRoll) {
        const button = document.querySelector('button.roll');
        button.disabled = true;

        const win = new Event('winGame');
        win.data = { player: player, name: name };
        window.dispatchEvent(win);
        return;
      }

      const message = `(Player ${player}) ${name} rolled a ${roll} and moved to position ${newPosition}.`;

      this.addNotification(message);
      this.updatePlayerPosition(currentPlayer, newPosition);

      this.drawAll();

      if (roll !== 6) {
        this.updateCurrentPlayer();
      } else {
        const message = `Player ${player} rolled a ${roll}, please roll again!`;
        this.addNotification(message);
      }
    };

    const element = document.getElementById('dice');
    rollADie({element, numberOfDice: 1, callback});
  }

  isTrap(pos) {
    return this.getTrapPosition(pos);
  }

  getTrapPosition(pos) {
    const result = this.state.traps.filter(item => item.position.x == pos.x && item.position.y == pos.y);

    if (result.length > 0) {
      return true;
    }

    return false;
  };


  updatePlayerPosition(player, pos) {
    let newPosition = this.getUpdatedPosition(pos);

    if (this.isTrap(newPosition)) {
      const trapPenalty = Math.floor(Math.random() * 6) + 1;

      const message = `Dracarys! Dragon ahead, moving back ${trapPenalty} spaces.`;
      console.log(message);
      this.addNotification(message);
      newPosition = this.getUpdatedPosition(pos - 2);
    }

    this.state.players[player].position = newPosition;
  }

  updateCurrentPlayer() {
    const current = this.state.currentPlayer;

    if (current == 0) {
      this.state.currentPlayer = 1;
    } else {
      this.state.currentPlayer = 0;
    }
  }

  calculatePosition(current, roll) {
    const position = Number(current) + Number(roll);

    return position;
  }

  getUpdatedPosition(step) {
    const result = this.state.board.filter(item => item.position == step);

    const position = {
      step,
      x: result[0].x,
      y: result[0].y,
    };

    return position;
  };

  drawAll() {
    this.render(this.canvas, this.context);
  }

  drawBoard(ctx) {
    ctx.drawImage(this.bg, 0, 0);
  }

  drawGrid(ctx) {
    for (let i = 0; i <= 6; i++) {
      for (let j = 0; j <= 6; j++) {
        ctx.moveTo(0, 120 * j);
        ctx.lineTo(800, 120 * j);
        ctx.stroke();

        ctx.moveTo(133.33 * i, 0);
        ctx.lineTo(133.33 * i, 800);
        ctx.stroke();
      }
    }
  }

  drawTraps(ctx, a, b) {
    const traps = this.state.traps;
    const result = traps.filter(item => item.position.x == a && item.position.y == b);
    if (result.length >= 1) {
      const item = result[0];
      ctx.drawImage(this.trapicon, 0, 0, 290, 305, (b * 133.33) + 40, (a * 120) + 35, 100, 100);
    }
  }

  drawPlayers(ctx, a, b) {
    const player1 = this.state.players[0].position;
    const player2 = this.state.players[1].position;

    if (player1.x == a && player1.y == b) {
      ctx.drawImage(this.player1icon, 0, 0, 290, 305, (b * 133.33) + 20, (a * 120) + 18, 80, 80);
    }

    if (player2.x == a && player2.y == b) {
      ctx.drawImage(this.player2icon, 0, 0, 290, 305, (b * 133.33) + 30, (a * 120) + 28, 80, 80);
    }
  }

  drawPieces(ctx) {
    for (var a = 0; a <= 5; a++) {
      for (var b = 0; b <= 5; b++) {
        this.drawTraps(ctx, a, b);
        this.drawPlayers(ctx, a, b);
      }
    }
  }

  render(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawBoard(ctx);
    this.drawGrid(ctx);
    this.drawPieces(ctx);
  }

  matchWindowSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    //this.render(this.canvas, this.context);
  }

  trackWindowSize() {
    this.matchWindowSize();
    window.addEventListener('resize', this.matchWindowSize.bind(this));
  }
}

module.exports = Game;
