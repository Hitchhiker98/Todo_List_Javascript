const form = document.querySelector("#new-todo-form");
const todoInput = document.querySelector("#todo-input");
const list = document.querySelector("#list");
const template = document.querySelector("#list-item-template");
//because localStorage is domain specific, when working in a development enviroment localStorage item names can be in conflict (if localhost is the same for multiple projects). Thats why we use a prefix which is specific to the project.
const LOCAL_STORAGE_PREFIX = "ADVANCED_TODO_LIST";
const TODOS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`;
let todos = loadTodos();
todos.forEach(renderTodo);

//COMPLETE TODOS
list.addEventListener("change", (e) => {
  if (!e.target.matches("[data-list-item-checkbox]")) return;

  const parent = e.target.closest(".list-item");
  const todoId = parent.dataset.todoId;
  const todo = todos.find((t) => t.id === todoId);
  todo.complete = e.target.checked;
  saveTodos();
});
//DELETE TODOS
list.addEventListener("click", (e) => {
  if (!e.target.matches("[data-button-delete]")) return;

  const parent = e.target.closest(".list-item");
  const todoId = parent.dataset.todoId;
  parent.remove();
  todos = todos.filter((todo) => todo.id !== todoId);
  saveTodos();
});

//ADD TODOS
//user will type in todo and click add todo button. This should then add todo to the list above.
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const todoName = todoInput.value;
  // guard clase to make sure that submitted todo input is not empty
  if (todoName === "") return;
  const newTodo = {
    name: todoName,
    complete: false,
    //use milliseconds as a unique identifier.
    id: new Date().valueOf().toString(),
  };
  todos.push(newTodo);
  renderTodo(newTodo);
  saveTodos();
  todoInput.value = "";
});

function renderTodo(todo) {
  const templateClone = template.content.cloneNode(true);
  const listItem = templateClone.querySelector(".list-item");
  // Note how we can set custom data attiributes with dataset
  listItem.dataset.todoId = todo.id;
  const textElement = templateClone.querySelector("[data-list-item-text]");
  textElement.innerText = todo.name;
  const checkbox = templateClone.querySelector("[data-list-item-checkbox]");
  checkbox.checked = todo.complete;
  list.appendChild(templateClone);
}

//LOAD TODOS
function loadTodos() {
  const todosString = localStorage.getItem(TODOS_STORAGE_KEY);
  //could use null coalescing operator here as well
  return JSON.parse(todosString) || [];
}
//SAVE TODOS
function saveTodos() {
  //use serialising to tranfrom javascript array to string so it can be stored in localStorage
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
}
