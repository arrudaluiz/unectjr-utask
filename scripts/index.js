const quoteButton = document.querySelector('#quote-button');
const quoteModal = document.querySelector('#quote-modal');
const closeQuoteModalButton = document.querySelector(
  '#close-quote-modal-button'
);
const moveLeftButton = document.querySelector('#move-left-button');
const moveRightButton = document.querySelector('#move-right-button');
const listBoard = document.querySelector('#list-board');
const todoList = document.querySelector('#todo-list');
const doingList = document.querySelector('#doing-list');
const doneList = document.querySelector('#done-list');
const newTaskButton = document.querySelector('#new-task-button');
const taskModal = document.querySelector('#task-modal');
const closeTaskModalButton = document.querySelector('#close-task-modal-button');
const taskForm = document.querySelector('#task-form');
const taskTitleInput = document.querySelector('#title');
const taskDescriptionInput = document.querySelector('#description');
const listIndicators = document.querySelector('.board-footer').children;

const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const toDo = 'to do';
const doing = 'doing';
const done = 'done';

function createTask(task) {
  const taskElement = document.createElement('div');
  const taskBody = `
    <button class="expand active">
      <span>Ler descrição</span>
      <span aria-hidden="true" class="material-icons icon">expand_more</span>
    </button>
    <button class="expand highlighted">
      <span>Esconder descrição</span>
      <span aria-hidden="true" class="material-icons icon">expand_less</span>
    </button>
    <p class="description">${task.description}</p>`;
  const taskMoveButton = {
    back: `
      <button class="button back" aria-label="Retroceder tarefa">
        <span aria-hidden="true" class="material-icons icon">navigate_before</span>
      </button>`,
    forward: `
      <button class="button forward" aria-label="Avançar tarefa">
        <span aria-hidden="true" class="material-icons icon">navigate_next</span>
      </button>`,
    restart: `
      <button class="button restart" aria-label="Reiniciar tarefa">
        <span aria-hidden="true" class="material-icons icon">replay</span>
      </button>`
  };
  const taskContent = `
    <div class="header">
      <h3 class="title">${task.title}</h3>
      <button class="more-button" aria-label="Abrir menu da tarefa">
        <span aria-hidden="true" class="material-icons icon">more_vert</span>
      </button>
      <div class="menu">
        <button class="option-button edit-button">
          <span aria-hidden="true" class="material-icons icon">edit</span>
          <span>Editar</span>
        </button>
        <button class="option-button delete-button">
          <span aria-hidden="true" class="material-icons icon">delete_outline</span>
          <span>Excluir</span>
        </button>
      </div>
    </div>
    <div class="body">
      <div class="task-info">
        ${task.description === '' ? '' : taskBody}
      </div>
      <div class="task-move">
        ${
          task.status === toDo
            ? taskMoveButton.forward
            : task.status === doing
            ? taskMoveButton.back + taskMoveButton.forward
            : taskMoveButton.back + taskMoveButton.restart
        }
      </div>
    </div>`;

  taskElement.setAttribute('id', task.id);
  taskElement.setAttribute('class', 'task');
  taskElement.insertAdjacentHTML('afterbegin', taskContent);

  return taskElement;
}

function updateListBoard() {
  tasks.map((task) => {
    const taskElement = createTask(task);
    switch (task.status) {
      case toDo:
        todoList.appendChild(taskElement);
        break;

      case doing:
        doingList.appendChild(taskElement);
        break;

      case done:
        doneList.appendChild(taskElement);
        break;

      default:
        console.error('task ' + task.title + ' was not handled');
        break;
    }
  });
}

function saveTask(event) {
  event.preventDefault();

  if (taskForm.lastElementChild.name === 'add') {
    const task = {
      id: `task-${crypto.randomUUID()}`,
      title: taskTitleInput.value,
      description: taskDescriptionInput.value,
      status: toDo
    };

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    const taskElement = createTask(task);
    todoList.appendChild(taskElement);
  } else {
    const index = tasks.findIndex(
      (task) => task.id === taskForm.lastElementChild.value
    );
    tasks[index].title = taskTitleInput.value;
    tasks[index].description = taskDescriptionInput.value;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    const taskElement = createTask(tasks[index]);
    listBoard.querySelector(`#${tasks[index].id}`).replaceWith(taskElement);
  }
  taskForm.reset();
  taskModal.classList.remove('modal-active');
}

function moveTaskBack(id) {
  const index = tasks.findIndex((task) => task.id === id);
  let taskElement = null;
  document.querySelector('#' + id).remove();

  switch (tasks[index].status) {
    case done:
      tasks[index].status = doing;
      taskElement = createTask(tasks[index]);
      doingList.appendChild(taskElement);
      break;

    case doing:
      tasks[index].status = toDo;
      taskElement = createTask(tasks[index]);
      todoList.appendChild(taskElement);
      break;

    default:
      console.error('Task ' + tasks[index].title + ' was not handled');
      break;
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function moveTaskForward(id) {
  const index = tasks.findIndex((task) => task.id === id);
  let taskElement = null;
  document.querySelector('#' + id).remove();

  switch (tasks[index].status) {
    case toDo:
      tasks[index].status = doing;
      taskElement = createTask(tasks[index]);
      doingList.appendChild(taskElement);
      break;

    case doing:
      tasks[index].status = done;
      taskElement = createTask(tasks[index]);
      doneList.appendChild(taskElement);
      break;

    case done:
      tasks[index].status = toDo;
      taskElement = createTask(tasks[index]);
      todoList.appendChild(taskElement);
      break;

    default:
      console.error('Task ' + tasks[index].title + ' was not handled');
      break;
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function editTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  taskForm.lastElementChild.name = 'edit';
  taskForm.lastElementChild.value = id;
  taskTitleInput.value = tasks[index].title;
  taskDescriptionInput.value = tasks[index].description;
  taskModal.firstElementChild.classList.add('editing');
  taskModal.classList.add('modal-active');
}

function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  document.querySelector('#' + id).remove();
}

if (localStorage.getItem('tasks')) {
  updateListBoard();
}

/**
 * Event Listeners
 */
quoteButton.addEventListener('click', () => {
  quoteModal.classList.add('modal-active');
});

closeQuoteModalButton.addEventListener('click', () => {
  quoteModal.classList.remove('modal-active');
});

moveLeftButton.addEventListener('click', () => {
  for (const indicator of listIndicators) {
    indicator.classList.remove('active');
  }
  if (listBoard.classList.contains('end')) {
    listBoard.classList.remove('end');
    listBoard.classList.add('center');
    listIndicators[1].classList.add('active');
  } else if (listBoard.classList.contains('center')) {
    listBoard.classList.remove('center');
    listBoard.classList.add('start');
    listIndicators[0].classList.add('active');
  }
});

moveRightButton.addEventListener('click', () => {
  for (const indicator of listIndicators) {
    indicator.classList.remove('active');
  }
  if (listBoard.classList.contains('start')) {
    listBoard.classList.remove('start');
    listBoard.classList.add('center');
    listIndicators[1].classList.add('active');
  } else if (listBoard.classList.contains('center')) {
    listBoard.classList.remove('center');
    listBoard.classList.add('end');
    listIndicators[2].classList.add('active');
  }
});

newTaskButton.addEventListener('click', () => {
  taskForm.lastElementChild.name = 'add';
  taskModal.classList.add('modal-active');
});

closeTaskModalButton.addEventListener('click', () => {
  taskForm.reset();
  taskModal.firstElementChild.classList.remove('editing');
  taskModal.classList.remove('modal-active');
});

taskForm.addEventListener('submit', saveTask);

listBoard.addEventListener('click', (event) => {
  if (
    event.target.classList.contains('back') ||
    event.target.parentElement.classList.contains('back')
  ) {
    /** Move task back button */
    const taskId = event.target.closest('.task').id;
    moveTaskBack(taskId);
  } else if (
    event.target.classList.contains('forward') ||
    event.target.parentElement.classList.contains('forward') ||
    event.target.classList.contains('restart') ||
    event.target.parentElement.classList.contains('restart')
  ) {
    /** Move task forward button */
    const taskId = event.target.closest('.task').id;
    moveTaskForward(taskId);
  } else if (
    event.target.classList.contains('expand') ||
    event.target.parentElement.classList.contains('expand')
  ) {
    /** Expand task description button */
    const taskId = event.target.closest('.task').id;
    const children = listBoard.querySelector(`#${taskId} .task-info`).children;
    for (const child of children) {
      child.classList.toggle('active');
    }
  } else if (
    event.target.classList.contains('more-button') ||
    event.target.parentElement.classList.contains('more-button')
  ) {
    /** Task menu button */
    const taskId = event.target.closest('.task').id;
    listBoard.querySelector(`#${taskId} .menu`).classList.toggle('active');
  } else if (
    event.target.classList.contains('edit-button') ||
    event.target.parentElement.classList.contains('edit-button')
  ) {
    /** Task edit button */
    const taskId = event.target.closest('.task').id;
    listBoard.querySelector(`#${taskId} .menu`).classList.remove('active');
    editTask(taskId);
  } else if (
    event.target.classList.contains('delete-button') ||
    event.target.parentElement.classList.contains('delete-button')
  ) {
    /** Task delete button */
    const taskId = event.target.closest('.task').id;
    listBoard.querySelector(`#${taskId} .menu`).classList.remove('active');
    deleteTask(taskId);
  }
});

listIndicators[0].addEventListener('click', () => {
  listBoard.classList.remove('center', 'end');
  listBoard.classList.add('start');
  listIndicators[1].classList.remove('active');
  listIndicators[2].classList.remove('active');
  listIndicators[0].classList.add('active');
});

listIndicators[1].addEventListener('click', () => {
  listBoard.classList.remove('start', 'end');
  listBoard.classList.add('center');
  listIndicators[0].classList.remove('active');
  listIndicators[2].classList.remove('active');
  listIndicators[1].classList.add('active');
});

listIndicators[2].addEventListener('click', () => {
  listBoard.classList.remove('start', 'center');
  listBoard.classList.add('end');
  listIndicators[0].classList.remove('active');
  listIndicators[1].classList.remove('active');
  listIndicators[2].classList.add('active');
});
