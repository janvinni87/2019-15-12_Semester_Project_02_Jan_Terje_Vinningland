"use strict";

import CharacterSelect from './src/character-select';
import Game from './src/game';

const state = {
  characters: [],
};

const game = 'game';
const characterSelect = 'character-select';
const characterSelectorForm = 'character-selector';

const validateForm = (event) => {
  event.preventDefault();

  const max = 2;
  let count = 1;
  let maxReached = false;

  const characters = [];
  const message = 'You must choose 2 players!';

  const form = document.getElementById(characterSelect);
  const checkboxes = form.querySelectorAll('input[type=checkbox]:checked')

  for (const item of checkboxes) {
    if (count > max) {
      maxReached = true;
      alert(message);
      return false;
    } else {
      characters.push(item.value);
      count++;
    }
  }

  if (characters.length !== 2) {
    alert(message);
    return false;
  }

  state.characters = characters;

  const play = new Event('playGame');
  play.characters = characters;
  window.dispatchEvent(play);
};

window.addEventListener('load', (event) => {
  CharacterSelect();

  const form = document.getElementById(characterSelectorForm);
  form.addEventListener('submit', validateForm);
});

const hideCharacterSelect = () => {
  const div = document.getElementById(characterSelect);
  div.style.display = 'none';
};

const showGame = () => {
  const div = document.getElementById(game);
  div.style.display = 'block';
};

window.addEventListener('playGame', (event) => {
  hideCharacterSelect();
  showGame();

  const canvas = document.getElementById('board');
  const game = new Game(canvas, event.characters);

  game.drawAll();
  window.game = game;
});
