// Tutaj dodacie zmienne globalne do przechowywania elementów takich jak np. lista czy input do wpisywania nowego todo
let $list;
let form;
let addTodoBtn;
let myInput;
let $popup;
let popup_id;
const initialList = ['Dzisiaj robię usuwanie', 'Nakarm psa'];

function main() {
    prepareDOMElements();
    prepareDOMEvents();
    prepareInitialList();
}

function prepareDOMElements() {
    // To będzie idealne miejsce do pobrania naszych elementów z drzewa DOM i zapisanie ich w zmiennych
    $list = document.getElementById('list');
    $popup = document.getElementById('myModal');
    form = document.querySelector('#addForm');
    myInput = document.querySelector('#myInput');
    AddTodoBtn = document.querySelector('#addTodo');
}

function prepareDOMEvents() {
    // Przygotowanie listenerów
    $list.addEventListener('click', listClickManager);
    form.addEventListener('submit', addNewTodoViaForm);
    $popup.addEventListener('click', onPopupClicked);
}

function addNewTodoViaForm(event) {
    event.preventDefault();
    addNewTodo();
}

function addNewTodo() {
    if (myInput.value.trim() !== '') {
        //addNewElementToList(myInput.value);
        submitNewTodo(myInput.value);
        myInput.value = '';
    }
}

function submitNewTodo(title) {
    let request = new XMLHttpRequest();
    request.open('POST', 'http://195.181.210.249:3000/todo/', true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.onload = initTodoList;
    let data = 'title=' + title;
    request.send(data);
}

function prepareInitialList() {
    // Tutaj utworzymy sobie początkowe todosy. Mogą pochodzić np. z tablicy
    /*initialList.forEach(todo => {
      addNewElementToList(todo);
    });*/

    initTodoList();
}

function initTodoList() {
    let request = new XMLHttpRequest();
    request.open('GET', 'http://195.181.210.249:3000/todo/', true);
    request.onload = function() {
        let data = JSON.parse(this.response);
        while ($list.firstChild) {
            $list.removeChild($list.firstChild);
        }
        data.forEach(record => {
            addNewElementToList(record.title, record.id, record.extra);
        });
    }
    request.send();
}

function addNewElementToList(title, id /* Title, author, id */ ) {
    //obsługa dodawanie elementów do listy
    // $list.appendChild(createElement('nowy', 2))
    const newElement = createElement(title, id);
    $list.appendChild(newElement);
}

function createElement(title, id /* Title, author, id */ ) {
    // Tworzyc reprezentacje DOM elementu return newElement
    // return newElement
    const newElement = document.createElement('li');
    newElement.id = id;

    const span = document.createElement('span');
    span.innerText = title;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.className = 'delete';

    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.className = 'edit';

    const doneBtn = document.createElement('button');
    doneBtn.innerText = 'Mark As Done';
    doneBtn.className = 'done';

    newElement.appendChild(span);
    newElement.appendChild(deleteBtn);
    newElement.appendChild(editBtn);
    newElement.appendChild(doneBtn);

    return newElement;
}

function listClickManager(event /*- event.target */ ) {
    // Rozstrzygnięcie co dokładnie zostało kliknięte i wywołanie odpowiedniej funkcji
    // event.target.parentElement.id
    // if (event.target.className === 'edit') { editListElement(id) }
    if (event.target.localName === 'button') {
        switch (event.target.className) {
            case 'delete':
                {
                    deleteTodo(event.target.parentElement);
                    break;
                }
            case 'edit':
                {
                    editTodo(event.target.parentElement);
                    break;
                }
            case 'done':
                {
                    markTodoAsDone(event.target.parentElement);
                    break;
                }
            default:
                {
                    console.log('Not supported value');
                }
        }

        console.log(event.target.parentElement);
    }
}

function deleteTodo(element) {
    console.log('Delete call');
    submitDeleteTodo(element.id);
}

function submitDeleteTodo(id) {
    let request = new XMLHttpRequest();
    request.open('DELETE', 'http://195.181.210.249:3000/todo/' + id, true);
    request.onload = initTodoList;
    request.send();
}

function editTodo(element) {
    console.log('Edit call');
    openPopup(element);
}

function submitChangeTodo(id, title) {
    let request = new XMLHttpRequest();
    request.open('PUT', 'http://195.181.210.249:3000/todo/' + id, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.onload = initTodoList;
    let data = 'title=' + title;
    request.send(data);
}

function markTodoAsDone(element) {
    console.log('Mark as done call');
    element.style.color = 'gray'
}

function openPopup(element) {
    // Otwórz popup
    // Find element index in <ul >
    popup_id = element.id;

    const current_text = element.childNodes[0].innerText;
    document.getElementById('popupInput').value = current_text;
    $popup.style.display = 'flex';
}

function closePopup() {
    // Zamknij popup
    $popup.style.display = 'none';
}

function onPopupClicked(event) {
    if (event.target.id === 'closePopup') {
        closePopup();
        return;
    }

    if (event.target.localName === 'button') {
        switch (event.target.id) {
            case 'acceptTodo':
                {
                    let new_title = document.getElementById('popupInput').value;
                    submitChangeTodo(popup_id, new_title);
                    closePopup();
                    return;
                }
            case 'cancelTodo':
                {
                    closePopup();
                    return;
                }
        }
    }
}

/*
GET http://195.181.210.249:3000/todo/  - pobiera listę TODO
POST http://195.181.210.249:3000/todo/ - dodaje nowe TODO. Wymaganą daną jest parametr title, przykład: {"title":"Test"}
DELETE http://195.181.210.249:3000/todo/id  - usuwa TODO o podanym w URLu id
PUT http://195.181.210.249:3000/todo/id - aktualizuje TODO o podanym w URLu id. Aktualizacja wymaga przesłania parametru title w celu modyfikacji tytułu TODO, przykład: {"title":"test"}
*/

document.addEventListener('DOMContentLoaded', main);