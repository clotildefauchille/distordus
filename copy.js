
/**
 * Todolist
 */
const tasks = [
  {
    label: 'Faire une todolist en JS',
    done: true
  },
  {
    label: 'Faire une todolist en React',
    done: true
  },
  {
    label: 'Coder Facebook',
    done: true
  }
];

var app = {
  init: function () {
    app.container = document.getElementById('todo');
    // il faut vider le container avant de relancer la création de l'interface
    app.container.innerHTML = '';

    app.createForm();
    app.createCounter();
    app.createTaskList();
  },
  createForm: () => {
    const form = document.createElement('form');
    form.className = 'form';
    // form.classList.add('form');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Ajouter une tâche';
    input.className = 'form__input';

    form.append(input);

    // on va écouter les événements de type submit sur le form
    form.addEventListener('submit', app.addTask);

    app.container.appendChild(form);
  },
  createCounter: () => {
    app.counter = document.createElement('p');
    app.counter.className = 'counter';

    app.container.appendChild(app.counter);
    app.updateCounter();
  },
  createTaskList: () => {
    app.taskList = document.createElement('ul');
    app.taskList.className = 'tasks';

    tasks.forEach(task => app.generateTask(task));

    app.container.appendChild(app.taskList);
  },
  updateCounter: () => {
    // on filtre le tableau de tâches pour ne récupérer
    // que les tâches qui ont la proriété done à false
    const undoneTasks = tasks.filter(task => {
      return !task.done;
      // return task.done === false;
    });

    // on calcule la longueur du tableau
    const undoneTasksNumber = undoneTasks.length;

    let text = 'Aucune tâche en cours';

    if (undoneTasksNumber === 1) {
      text = `${undoneTasksNumber} tâche en cours`;
    }
    else if (undoneTasksNumber > 1) {
      text = `${undoneTasksNumber} tâches en cours`;
    }

    app.counter.textContent = text;
  },
  addTask: (event) => {
    // pour rappel, il faut empêcher le comportement par défaut du formulaire
    // pour ne pas avoir de rafraichissement
    event.preventDefault();

    // récupéreration de la valeur de l'input
    const value = event.target[0].value;

    // préparation des données de la tâche
    const newTask = {
      label: value,
      done: false
    };

    // on lance la fonction qui va générer la nouvelle tâche
    // app.generateTask(newTask);

    // on vient désomrais rajouter la nouvelle aux données
    tasks.push(newTask);

    app.init();
  },
  generateTask: (data) => {
    const li = document.createElement('li');
    li.className = 'task';

    if (data.done) {
      li.classList.add('task--done');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task__checkbox';
    checkbox.id = data.label;
    checkbox.checked = data.done;

    // on veut écouter l'événement lorsqu'une case à cocher est cochée ou décochée
    checkbox.addEventListener('change', () => {
      data.done = !data.done;
      app.init();
    });

    li.appendChild(checkbox);

    const label = document.createElement('label');
    label.htmlFor = data.label;
    label.textContent = data.label;
    li.appendChild(label);

    // à chaque tâche créee j'incrémente le count de 1
    // on rafraichit la vue du counter
    // si celle-ci n'est pas faite
    if (!data.done) {
      app.count++;
      app.updateCounter();
    }
    app.taskList.appendChild(li);
  }
};
