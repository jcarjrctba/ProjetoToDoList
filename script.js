// ponto de controle //

let buttonNewToDo = document.querySelector('#buttonNewToDo');
let toDoList = document.querySelector('#toDoList');
let editModal = document.querySelector('#editModal');
let backgroundModal = document.querySelector('#backgroundModal');
let buttonCloseModal = document.querySelector('#buttonCloseModal');
let buttonUpdateToDo = document.querySelector('#buttonUpdateToDo');
let displayId = document.querySelector('#displayId');
let inputEditToDo = document.querySelector('#inputEditToDo');
let localStorageToDo = [];
let localStorageKey = 'toDoList';

getToDoFromLocalStorage();
renderToDo();

buttonNewToDo.addEventListener('click', e => {
  inputEditToDo.value = '';
  displayId.value = '';
  alternateModal();
});

buttonCloseModal.addEventListener('click', e => {
  alternateModal();
  displayId.innerText = '';
});

buttonUpdateToDo.addEventListener('click', e => {
  if (!inputEditToDo.value) {
    alert('Sem caracteres, tente novamente!');
    alternateModal();
    displayId.innerText = '';
  } else {
    e.preventDefault();
    let toDoId = displayId.innerHTML.replace('#', '');

    let toDo = {
      name: inputEditToDo.value,
      id: displayId.innerHTML.replace('#', ''),
    };

    if (document.getElementById(`${toDoId}`)) {
      let toDoIndex = getToDoIndex(toDoId);
      localStorageToDo[toDoIndex] = toDo;
      saveLocalStorage();
      let updatedLi = createNewLi(toDo);
      toDoList.replaceChild(updatedLi, document.getElementById(`${toDoId}`));
      alternateModal();
    } else {
      let toDo = {
        name: inputEditToDo.value,
        id: createRandomId(),
      };
      addToDo(toDo);
      alternateModal();
    }
  }
});

function createRandomId() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

function compareId() {
  let toDoItens = document.querySelector('#toDoList').children;
  let myIds = [];

  for (let i = 0; i < toDoItens[i].id; i++) {
    myIds.push(toDoItens[i].id);
  }

  let availableIds = Number.MAX_SAFE_INTEGER;
  let idCounter = 0;
  let newId = createRandomId();

  while (idCounter <= availableIds && myIds.indexOf(newId.toString()) > -1) {
    newId = createRandomId;
    idCounter++;
    if (idCounter >= availableIds) {
      alert('Erro interno: quantidade de IDs excedida');
      throw new Error('Erro interno: sem mais IDs disponiveis');
    }
  }

  return newId;
}

function addToDo(toDo) {
  localStorageToDo.push(toDo);
  saveLocalStorage(localStorageToDo);
  renderToDo();
}

function createNewLi(toDo) {
  let newLi = document.createElement('li');
  newLi.id = toDo.id;
  let newDiv2 = document.createElement('div');
  newDiv2.classList.add('spanContainer');
  let newSpan = document.createElement('span');
  newSpan.classList.add('toDoText');
  newSpan.innerHTML = toDo.name;

  let newDiv = document.createElement('div');
  newDiv.classList.add('buttonContainer');
  let newEditBtn = document.createElement('button');
  newEditBtn.classList.add('actBtn');
  newEditBtn.setAttribute('onclick', `editToDo(${toDo.id})`);
  newEditBtn.innerHTML = '<i class="fa fa-pencil"></i>';

  let newDeleteBtn = document.createElement('button');
  newDeleteBtn.classList.add('actBtn');
  newDeleteBtn.setAttribute('onclick', `deleteToDo(${toDo.id})`);
  newDeleteBtn.innerHTML = '<i class="fa fa-trash"></i>';

  newDiv.appendChild(newEditBtn);
  newDiv.appendChild(newDeleteBtn);

  newLi.appendChild(newDiv2);
  newDiv2.appendChild(newSpan);
  newLi.appendChild(newDiv);

  return newLi;
}

function editToDo(toDoId) {
  let selectLi = document.getElementById(`${toDoId}`);
  if (selectLi) {
    displayId.innerHTML = `#${toDoId}`;
    inputEditToDo.value = selectLi.innerText;
    alternateModal();
  } else {
    alert('Elemento HTML não encontrado');
  }
}

function deleteToDo(toDoId) {
  let confirm = window.confirm('Deseja excluir?');
  if (confirm) {
    let toDoIndex = getToDoIndex(toDoId);
    localStorageToDo.splice(toDoIndex, 1);
    saveLocalStorage();

    let selectLi = document.getElementById(`${toDoId}`);
    if (selectLi) {
      toDoList.removeChild(selectLi);
      displayId.innerText = '';
    } else {
      alert('Elemento HTML não encontrado');
    }
  }
}

function alternateModal() {
  editModal.classList.toggle('opened');
  backgroundModal.classList.toggle('opened');
}

function getToDoIndex(toDoId) {
  let toDoIndex = localStorageToDo.findIndex(toDo => toDo.id == toDoId);
  if (toDoIndex < 0) {
    throw new Error('Não foi possível recuperar o ID', toDoId);
  }

  return toDoIndex;
}

function renderToDo() {
  toDoList.innerHTML = '';
  for (let i = 0; i < localStorageToDo.length; i++) {
    let newLi = createNewLi(localStorageToDo[i]);
    toDoList.appendChild(newLi);
  }

  inputEditToDo.value = '';
}

function getToDoFromLocalStorage() {
  if (localStorage.getItem(localStorageKey)) {
    localStorageToDo = JSON.parse(localStorage.getItem(localStorageKey));
  }
}

function saveLocalStorage() {
  localStorage.setItem(localStorageKey, JSON.stringify(localStorageToDo));
}
