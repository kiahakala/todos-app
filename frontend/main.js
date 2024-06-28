const BASE_URL = "https://todos-app-api-ts84.onrender.com/todos/";

// executes when the page is loaded
function init() {
  let infoText = document.getElementById("infoText");
  infoText.innerHTML = "Fetching tasks, please wait...";
  loadTodos();
}

// fetch todos from server
async function loadTodos() {
  let response = await fetch(BASE_URL);
  let todos = await response.json();
  console.log(todos);
  showTodos(todos);
}

function createTodoListItem(todo) {
  // create a new LI element
  let li = document.createElement("li");
  // create a new id attribute
  let li_attr = document.createAttribute("id");
  // attach the mongoDB id to the attribute
  li_attr.value = todo._id;
  // attach the attribute to the LI element
  li.setAttributeNode(li_attr);
  // create a new text node with the todo text
  let text = document.createTextNode(todo.text);
  // add the text node to the LI element
  li.appendChild(text);
	let controls = document.createElement("div");
	let controls_attr = document.createAttribute("class");
	controls_attr.value = "controls";
	controls.setAttributeNode(controls_attr);
  // create new SPAN elements for the delete and edit marks
  let editSpan = document.createElement("span");
  let delSpan = document.createElement("span");
  // create new class attributes
  let editSpan_attr = document.createAttribute("class");
  let delSpan_attr = document.createAttribute("class");
  // attach the class value to the attributes for styling
  editSpan_attr.value = "edit";
  delSpan_attr.value = "delete";
  // attach the attribute to the SPAN element
  editSpan.setAttributeNode(editSpan_attr);
  delSpan.setAttributeNode(delSpan_attr);
  // create a new text node with the 'x' character
  let edit = document.createTextNode("✏️");
  let x = document.createTextNode("❌");
  // attach the text node to the SPAN element
  editSpan.appendChild(edit);
  delSpan.appendChild(x);
  // define the onclick event for the SPAN element
  editSpan.onclick = function () {
    editTodo(todo._id);
  };
  delSpan.onclick = function () {
    removeTodo(todo._id);
  };
	controls.appendChild(editSpan);
	controls.appendChild(delSpan);
  li.appendChild(controls);

  return li;
}

function showTodos(todos) {
  let todosList = document.getElementById("todosList");
  let infoText = document.getElementById("infoText");
  // no todos
  if (todos.length === 0) {
    infoText.innerHTML = "No tasks to show";
  } else {
    todos.forEach((todo) => {
      let li = createTodoListItem(todo);
      todosList.appendChild(li);
    });
    infoText.innerHTML = "";
  }
}

async function addTodo() {
  let newTodo = document.getElementById("newTodo");
  let text = newTodo.value;
  if (text === "") {
    alert("Input cannot be empty!");
    return;
  }
  const data = { text: text };
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let todo = await response.json();
  let todosList = document.getElementById("todosList");
  let li = createTodoListItem(todo);
  todosList.appendChild(li);

  let infoText = document.getElementById("infoText");
  infoText.innerHTML = "";
  newTodo.value = "";
}

async function removeTodo(id) {
  const response = await fetch(`${BASE_URL}${id}`, {
    method: "DELETE",
  });
  let responseJson = await response.json();
  console.log(responseJson);
  let li = document.getElementById(id);
  li.parentNode.removeChild(li);

  let todosList = document.getElementById("todosList");
  if (!todosList.hasChildNodes()) {
    let infoText = document.getElementById("infoText");
    infoText.innerHTML = "No tasks to show";
  }
}

function editTodo(id) {
  onEdit = true;
  const button = document.getElementsByTagName("button")[0];
  const newTodo = document.getElementById("newTodo");
  const li = document.getElementById(id);
  let text = li.firstChild.nodeValue;
  newTodo.value = text;

  button.innerHTML = "Save";
  button.style.backgroundColor = "rgb(215, 180, 0)";
  button.onclick = () => updateTodo(id);
}

async function updateTodo(id) {
  const newTodo = document.getElementById("newTodo");
  const text = newTodo.value;
  let li = document.getElementById(id);

  const data = { text: text };
  const response = await fetch(`${BASE_URL}${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let updatedData = await response.json();
  li.firstChild.nodeValue = updatedData.text;

  newTodo.value = "";
  const button = document.getElementsByTagName("button")[0];
	button.style.backgroundColor = "rgb(219, 131, 0)";
  button.innerHTML = "Add Todo";
}
