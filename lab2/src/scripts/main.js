document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form');
  const titleInput = form.querySelector('input[name="title"]');
  const descriptionInput = form.querySelector('input[name="description"]');
  const tasksEmpty = document.querySelector('.tasks__empty');
  const taskTemplate = document.getElementById('task-template');
  const tasksSection = document.querySelector('.tasks-section');
  const alertBox = document.querySelector('.alert');
  const editWindow = document.querySelector('.edit-window');
  const shareBox = document.querySelector('.share-window');
  const editTitleInput = editWindow.querySelector('input[name="new-title"]');
  const editDescInput = editWindow.querySelector('textarea[name="new-description"]');

  const STORAGE_KEY = 'tasks';
  let taskToDelete = null;
  let taskToEdit = null;

  const taskList = document.createElement('ul');
  taskList.classList.add('tasks-list');
  tasksSection.appendChild(taskList);

  const toggleModal = (el, show = false) => el.classList.toggle('hidden', !show);
  const updateEmptyState = () => tasksEmpty.style.display = taskList.children.length ? 'none' : 'block';
  const getTasksFromDOM = () => [...taskList.querySelectorAll('.task')].map(task => ({
    title: task.querySelector('.task__title').textContent,
    description: task.querySelector('.task__description').textContent
  }));

  const saveTasks = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(getTasksFromDOM()));
  const loadTasks = () => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    saved.forEach(task => taskList.appendChild(createTask(task.title, task.description)));
    updateEmptyState();
  };

  function createTask(title, description) {
    const clone = taskTemplate.content.cloneNode(true);
    clone.querySelector('.task__title').textContent = title || 'Task Title...';
    clone.querySelector('.task__description').textContent = description || 'Task body about this task...';
    return clone;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    if (!title && !description) return;

    taskList.appendChild(createTask(title, description));
    saveTasks();
    updateEmptyState();
    form.reset();
  });

  taskList.addEventListener('click', e => {
    const task = e.target.closest('.task');
    if (!task) return;

    if (e.target.closest('.button--delete')) {
      taskToDelete = task;
      return toggleModal(alertBox, true);
    }

    if (e.target.closest('.button--edit')) {
      taskToEdit = task;
      editTitleInput.value = task.querySelector('.task__title').textContent;
      editDescInput.value = task.querySelector('.task__description').textContent;
      return toggleModal(editWindow, true);
    }

    if (e.target.closest('.button--share')) {
      return toggleModal(shareBox, true);
    }

    if (e.target.closest('.task__content')) {
      const tools = task.querySelector('.task__tools');
      tools.classList.toggle('hidden');
    }
  });

  alertBox.addEventListener('click', e => {
    if (e.target.classList.contains('button--confirm') && taskToDelete) {
      taskToDelete.remove();
      taskToDelete = null;
      saveTasks();
      updateEmptyState();
    }
    if (e.target.classList.contains('button--cancel') || e.target === alertBox) {
      taskToDelete = null;
    }
    toggleModal(alertBox, false);
  });

  editWindow.addEventListener('click', e => {
    const content = editWindow.querySelector('.edit-window__content');

    if (!content.contains(e.target)) {
      taskToEdit = null;
      return toggleModal(editWindow, false);
    }

    if (e.target.classList.contains('button--confirm') && taskToEdit) {
      const newTitle = editTitleInput.value.trim();
      const newDesc = editDescInput.value.trim();

      if (newTitle) {
        taskToEdit.querySelector('.task__title').textContent = newTitle;
      }
      if (newDesc) {
        taskToEdit.querySelector('.task__description').textContent = newDesc;
      }

      saveTasks();
      taskToEdit = null;
      toggleModal(editWindow, false);
    }

    if (e.target.classList.contains('button--cancel')) {
      taskToEdit = null;
      toggleModal(editWindow, false);
    }
  });

  shareBox.addEventListener('click', e => {
    if (e.target === shareBox) {
      toggleModal(shareBox, false);
    }
  });

  loadTasks();
});
