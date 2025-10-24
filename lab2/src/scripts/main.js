document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.form');
  const titleInput = document.querySelector('input[name="title"]');
  const descriptionInput = document.querySelector('input[name="description"]');
  const tasksEmpty = document.querySelector('.tasks__empty');
  const taskTemplate = document.getElementById('task-template');
  const tasksSection = document.querySelector('.tasks-section');
  const alert = document.querySelector('.alert');
  const confirmButton = document.querySelector('.button-confirm');
  const cancelButton = document.querySelector('.button-cancel');

  const taskList = document.createElement('ul');
  taskList.classList.add('tasks-list');
  tasksSection.appendChild(taskList);
  let taskToDelete = null;

  function createTask(title, description) {
    const taskClone = taskTemplate.content.cloneNode(true);
    const titleElement = taskClone.querySelector('.text__title');
    const descriptionElement = taskClone.querySelector('.text__description');
    const deleteButton = taskClone.querySelector('.button-delete');

    titleElement.textContent = title || 'Task Title...';
    descriptionElement.textContent = description || 'Task body about this task...';

    deleteButton.addEventListener('click', function () {
      taskToDelete = deleteButton.closest('.task');
      alert.classList.remove('hidden');
    });

    return taskClone;
  }

  confirmButton.addEventListener('click', function () {
    if (taskToDelete) {
      taskToDelete.remove();
      taskToDelete = null;
      updateEmptyState();
    }
    alert.classList.add('hidden');
  });

  cancelButton.addEventListener('click', function () {
    taskToDelete = null;
    alert.classList.add('hidden');
  });

  alert.addEventListener('click', function (e) {
    if (e.target === alert) {
      taskToDelete = null;
      alert.classList.add('hidden');
    }
  });

  function updateEmptyState() {
    tasksEmpty.style.display = taskList.children.length === 0 ? 'block' : 'none';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    taskList.appendChild(createTask(title, description));
    tasksEmpty.style.display = 'none';

    titleInput.value = '';
    descriptionInput.value = '';
  });
});