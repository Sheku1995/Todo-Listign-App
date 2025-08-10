const landingPage = document.getElementById('landing-page');
const todoPage = document.getElementById('todo-container');
const addTaskButton = document.getElementById('add-task-btn');
const taskForm = document.querySelector("dialog");
let taskTitleInput = document.getElementById('task-title');
let taskDescriptionInput = document.getElementById('task-description');
let taskPriorityInput = document.getElementById('task-priority');
let displayTotalTasks = document.getElementById("total-tasks-count");
let displayActiveTasks = document.getElementById("active-tasks-count");
let displayCompletedTasks = document.getElementById("completed-tasks-count");


let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let activeTasksCount = 0;
let completedTasksCount = 0;
let taskDate;
function gettingStarted() {
    landingPage.classList.add('hide');
    todoPage.classList.remove('hide');
    displayTasks();
};
function goBack() {
    todoPage.classList.add('hide');
    landingPage.classList.remove('hide');
    document.getElementById('todo-nav-bar').classList.remove('hide');
}
function openTaskForm() {
    taskForm.showModal();
}
function closeTaskForm() { 
    taskForm.close();
}
function addTask() {
  let title = taskTitleInput.value.trim();
  let description = taskDescriptionInput.value.trim()
  let priority = taskPriorityInput.value;
  let date = new Date();
    let days = date.getDate();
    let month = date.getMonth() + 1; 
    let year = date.getFullYear();
    taskDate = `${year}-${month}-${days}`;

    if (title === '' || description === '') {
        alert('Please fill in all fields');
        return;
    }

    if (editingIndex !== null) {
        tasks[editingIndex].title = title;
        tasks[editingIndex].description = description;
        tasks[editingIndex].priority = priority;
        editingIndex = null;
    } else {
        if (tasks.some(task => task.title === title && task.description === description)) {
            alert('Task already exists!');
            return;
        }
        let task = {
            title: title,
            description: description,
            priority: priority,
            date: taskDate,
            completed: false,
        };
        tasks.push(task);
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskTitleInput.value = '';
    taskDescriptionInput.value = '';
    taskPriorityInput.value = 'low';
    closeTaskForm();
    displayTasks();
}

let listTasks = document.getElementById('display-tasks');
function displayTasks() {
    completedTasksCount = 0;
    activeTasksCount = 0;
    listTasks.innerHTML = '';
    tasks.forEach((task, index) => {
        let taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <h4>${task.title}</h4>
            <p style="font-style: italic; font-weight: bold">${task.description}</p>
            <div class="task-details">
            <p style="font-weight: bold;">Priority:<span style="background-color: orange; border-radius: 5px;"> ${task.priority}</span></p>
            <p><span style="font-weight: bold;">${task.date}</span></p>
            <button class="complete-task-btn" title="Complete Task" data-index="${index}"> <i class="fa fa-check"></i></button>
            <button class="edit-task-btn" title="Edit Task" data-index="${index}"> <i class="fa fa-edit"></i></button>
            <button class="delete-task-btn" title="Delete Task" data-index="${index}"> <i class="fa fa-trash"></i></button>
            </div>
        `;
        if (task.completed) {
            taskItem.style.backgroundColor = '#85e69cff';
            completedTasksCount++;
        } else {
            taskItem.style.backgroundColor = '#f8d7da';
            activeTasksCount++;
        }
        listTasks.appendChild(taskItem);
    });

    displayTotalTasks.textContent = tasks.length;
    displayCompletedTasks.textContent = completedTasksCount;
    displayActiveTasks.textContent = activeTasksCount;

   
    listTasks.querySelectorAll('.complete-task-btn').forEach(btn => {
        btn.onclick = () => completeTask(Number(btn.dataset.index));
    });
    listTasks.querySelectorAll('.edit-task-btn').forEach(btn => {
        btn.onclick = () => editTask(Number(btn.dataset.index));
    });
    listTasks.querySelectorAll('.delete-task-btn').forEach(btn => {
        btn.onclick = () => deleteTask(Number(btn.dataset.index));
    });
}

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function completeTask(index) {
    tasks[index].completed = true;
    let date = new Date();
    let days = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    tasks[index].date = `${year}-${month}-${days}`;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}


let editingIndex = null;
function editTask(index) {
    let task = tasks[index];
    taskTitleInput.value = task.title;
    taskDescriptionInput.value = task.description;
    taskPriorityInput.value = task.priority;
    editingIndex = index;
    openTaskForm();
}


function addTask() {
    let title = taskTitleInput.value.trim();
    let description = taskDescriptionInput.value.trim();
    let priority = taskPriorityInput.value;
    let date = new Date();
    let days = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    taskDate = `${year}-${month}-${days}`;

    if (title === '' || description === '') {
        alert('Please fill in all fields');
        return;
    }

    if (editingIndex !== null) {
        
        tasks[editingIndex].title = title;
        tasks[editingIndex].description = description;
        tasks[editingIndex].priority = priority;
        
        editingIndex = null;
    } else {
      
        if (tasks.some(task => task.title === title && task.description === description)) {
            alert('Task already exists!');
            return;
        }
        let task = {
            title: title,
            description: description,
            priority: priority,
            date: taskDate,
            completed: false,
        };
        tasks.push(task);
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskTitleInput.value = '';
    taskDescriptionInput.value = '';
    taskPriorityInput.value = 'low';
    closeTaskForm();
    displayTasks();
}

let searchInput = document.getElementById('search-input');
searchInput.addEventListener("keyup", function() {
    let searchTerm = searchInput.value.toLowerCase();
    let filteredTasks = tasks
        .map((task, index) => ({ task, index }))
        .filter(({ task }) =>
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm)
        );

    listTasks.innerHTML = '';
    filteredTasks.forEach(({ task, index }) => {
        let taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <h4>${task.title}</h4>
            <p style="font-style: italic; font-weight: bold">${task.description}</p>
            <div class="task-details">
            <p style="font-weight: bold;">Priority:<span style="background-color: orange; border-radius: 5px;"> ${task.priority}</span></p>
            <p><span style="font-weight: bold;">${task.date}</span></p>
            <button class="complete-task-btn" title="Complete Task" data-index="${index}"> <i class="fa fa-check"></i></button>
            <button class="edit-task-btn" title="Edit Task" data-index="${index}"> <i class="fa fa-edit"></i></button>
            <button class="delete-task-btn" title="Delete Task" data-index="${index}"> <i class="fa fa-trash"></i></button>
            </div>
        `;
        listTasks.appendChild(taskItem);
    });
    if (filteredTasks.length === 0) {
        listTasks.innerHTML = '<p style="text-align: center;">No tasks found</p>';
    }

    
    listTasks.querySelectorAll('.complete-task-btn').forEach(btn => {
        btn.onclick = () => completeTask(Number(btn.dataset.index));
    });
    listTasks.querySelectorAll('.edit-task-btn').forEach(btn => {
        btn.onclick = () => editTask(Number(btn.dataset.index));
    });
    listTasks.querySelectorAll('.delete-task-btn').forEach(btn => {
        btn.onclick = () => deleteTask(Number(btn.dataset.index));
    });
});
let tasksCategory = document.getElementById('tasks-category');
tasksCategory.addEventListener('change', function() {
    let selectedCategory = tasksCategory.value;
    if (selectedCategory === 'all') {
        displayTasks();
    } else {
        let filteredTasks = tasks
            .map((task, index) => ({ task, index }))
            .filter(({ task }) => task.priority === selectedCategory);

        listTasks.innerHTML = '';
        filteredTasks.forEach(({ task, index }) => {
            let taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
                <h4>${task.title}</h4>
                <p style="font-style: italic; font-weight: bold">${task.description}</p>
                <div id="task-details">
                <p style="font-weight: bold;">Priority:<span style="background-color: orange; border-radius: 5px;"> ${task.priority}</span></p>
                <p><span style="font-weight: bold;">${task.date}</span></p>
                <button class="complete-task-btn" title="Complete Task" data-index="${index}"> <i class="fa fa-check"></i></button>
                <button class="edit-task-btn" title="Edit Task" data-index="${index}"> <i class="fa fa-edit"></i></button>
                <button class="delete-task-btn" title="Delete Task" data-index="${index}"> <i class="fa fa-trash"></i></button>
                </div>
            `;
            listTasks.appendChild(taskItem);
        });

       
        listTasks.querySelectorAll('.complete-task-btn').forEach(btn => {
            btn.onclick = () => completeTask(Number(btn.dataset.index));
        });
        listTasks.querySelectorAll('.edit-task-btn').forEach(btn => {
            btn.onclick = () => editTask(Number(btn.dataset.index));
        });
        listTasks.querySelectorAll('.delete-task-btn').forEach(btn => {
            btn.onclick = () => deleteTask(Number(btn.dataset.index));
        });
    }
});

displayTasks();