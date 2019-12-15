'use-strict';

import slugify from 'slugify';

const endpoint = 'https://anapioficeandfire.com/api';
const slugOptions = {
  replacement: '-',
  remove: null,
  lower: true,
};

const urlFetch = (endpoint) => {
  return fetch(endpoint)
    .then(response => {
      return response.json()
    }).then((json) => {
      return json;
    }).catch((ex) => {
      console.error('parsing failed', ex)
    });
};

const createItems = (items) => {
  const el = document.getElementById('character-selector');
  const elInner = document.createElement('div');
  elInner.setAttribute('class', 'character-wrap');

  let count = 1;

  for (const item of items) {
    const name = item.aliases[0];
    const slug = slugify(name, slugOptions);
    const race = item.culture ? item.culture : 'Unknown';
    const gender = item.gender ? item.gender : 'Unknown';

    const label = document.createElement('label');
    label.setAttribute('name', slug);
    label.setAttribute('class', `character class-${count}`);

    const characterWrap = document.createElement('div');

    const nameWrap = document.createElement('h2');
    nameWrap.innerHTML = name;
    characterWrap.appendChild(nameWrap);

    const raceWrap = document.createElement('p');
    raceWrap.innerHTML = race;
    characterWrap.appendChild(raceWrap);

    const genderWrap = document.createElement('p');
    genderWrap.innerHTML = gender;
    characterWrap.appendChild(genderWrap);

    const characterSelect = document.createElement('input');
    characterSelect.setAttribute('type', 'checkbox');
    characterSelect.setAttribute('name', slug);
    characterSelect.setAttribute('value', name);
    characterWrap.appendChild(characterSelect);

    label.appendChild(characterWrap)
    elInner.appendChild(label);

    count++;
  }

  el.appendChild(elInner);

  const characterSelectWrap = document.createElement('p');
  el.appendChild(characterSelectWrap);

  const characterSelect = document.createElement('input');
  characterSelect.setAttribute('type', 'submit');
  characterSelect.setAttribute('value', 'Play');
  characterSelectWrap.appendChild(characterSelect);
};

const toggleCheckbox = (e) => {
  e.preventDefault();

  const characterDiv = e.target.closest('.character');
  characterDiv.classList.toggle('selected');

  const checkbox = characterDiv.querySelector('input');
  checkbox.checked = !checkbox.checked;
};

const initCharacterSelect = () => {
  const fetch = urlFetch(`${endpoint}/characters`)
    .then(json => {
      createItems(json);

      const classname = document.getElementsByClassName('character');
      Array.from(classname).forEach(function(element) {
        element.addEventListener('click', toggleCheckbox);
      });

      return json;
    }).catch((ex) => {
      console.error('parsing failed', ex)
    });
};

module.exports = initCharacterSelect;
