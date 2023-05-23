const quoteButton = document.querySelector('#quote-button');
const quoteModal = document.querySelector('#quote-modal');
const closeQuoteModalButton = document.querySelector(
  '#close-quote-modal-button'
);
const todoList = document.querySelector('#todo-list');
const doingList = document.querySelector('#doing-list');
const doneList = document.querySelector('#done-list');
const newTaskButton = document.querySelector('#new-task-button');
const taskModal = document.querySelector('#task-modal');
const closeTaskModalButton = document.querySelector('#close-task-modal-button');
const taskForm = document.querySelector('#task-form');
const taskTitleInput = document.querySelector('#title');
const taskDescriptionInput = document.querySelector('#description');
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const toDo = 'to do';
const doing = 'doing';
const done = 'done';

if (localStorage.getItem('tasks')) {
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

function createTask(task) {
  const taskElement = document.createElement('div');
  const taskMoveButton = {
    back: `<button class="button back" aria-label="Retroceder tarefa">
            <span aria-hidden="true" class="material-icons icon">navigate_before</span>
          </button>`,
    forward: `<button class="button forward" aria-label="Avançar tarefa">
            <span aria-hidden="true" class="material-icons icon">navigate_next</span>
          </button>`,
    restart: `<button class="button restart" aria-label="Reiniciar tarefa">
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
        <button class="option-button delete-button">
          <span aria-hidden="true" class="material-icons icon">delete_outline</span>
          <span>Excluir</span>
        </button>
      </div>
    </div>
    <div class="body">
      <div class="task-info">
        <button class="expand active">
          <span>Ler descrição</span>
          <span aria-hidden="true" class="material-icons icon">expand_more</span>
        </button>
        <button class="expand highlighted">
          <span>Esconder descrição</span>
          <span aria-hidden="true" class="material-icons icon">expand_less</span>
        </button>
        <p class="description">${task.description}</p>
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

function addTask(event) {
  event.preventDefault();

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
  taskForm.reset();
  taskModal.classList.remove('modal-active');
}

function removeTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  document.querySelector('#' + id).remove();
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

newTaskButton.addEventListener('click', () => {
  taskModal.classList.add('modal-active');
});

closeTaskModalButton.addEventListener('click', () => {
  taskModal.classList.remove('modal-active');
});

taskForm.addEventListener('submit', addTask);

document.addEventListener('click', (event) => {
  if (
    event.target.classList.contains('more-button') ||
    event.target.parentElement.classList.contains('more-button')
  ) {
    const taskId = event.target.closest('.task').id;
    document.querySelector(`#${taskId} .menu`).classList.toggle('active');
  }

  if (
    event.target.classList.contains('delete-button') ||
    event.target.parentElement.classList.contains('delete-button')
  ) {
    const taskId = event.target.closest('.task').id;
    document.querySelector(`#${taskId} .menu`).classList.remove('active');
    removeTask(taskId);
  }
});

const taskInfos = document.querySelectorAll('.task-info');
taskInfos.forEach((taskInfo) =>
  taskInfo.addEventListener('click', () => {
    const expandButtons = taskInfo.querySelectorAll('.expand');
    expandButtons.forEach((expandButton) =>
      expandButton.classList.toggle('active')
    );
    taskInfo.querySelector('.description').classList.toggle('active');
  })
);
