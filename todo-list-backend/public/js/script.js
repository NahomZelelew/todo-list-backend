const taskInputs = document.querySelector('#taskInput');
const addButtons = document.querySelector('#addButton');
const taskLists = document.querySelector('#taskList');

async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();

        taskLists.innerHTML = '';
        tasks.forEach(function(task) {
            createTaskElement(task);
        });
    } catch (error) {
        console.error('Could not load tasks:', error);
    }
}

function createTaskElement(task) {
    const taskItem = document.createElement('li');
    const checkBox = document.createElement('input');
    const textSpan = document.createElement('span');
    const deleteButtons = document.createElement('button');

    checkBox.type = 'checkbox';
    checkBox.checked = Boolean(task.completed);

    textSpan.classList.add('taskText');
    textSpan.textContent = task.title;

    deleteButtons.textContent = 'Delete';
    deleteButtons.classList.add('deleteButton');

    taskItem.append(checkBox);
    taskItem.append(textSpan);
    taskItem.append(deleteButtons);

    if (task.completed) {
        taskItem.classList.add('completed');
    }

    deleteButtons.addEventListener('click', async function() {
        try {
            const response = await fetch(`/api/tasks/${task.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                taskItem.remove();
                renumberTasks();
            }
        } catch (error) {
            console.error('Could not delete task:', error);
        }
    });

    checkBox.addEventListener('change', async function() {
        try {
            const response = await fetch(`/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    completed: checkBox.checked
                })
            });

            if (response.ok) {
                taskItem.classList.toggle('completed', checkBox.checked);
            } else {
                checkBox.checked = !checkBox.checked;
            }
        } catch (error) {
            checkBox.checked = !checkBox.checked;
            console.error('Could not update task:', error);
        }
    });

    taskLists.append(taskItem);
    renumberTasks();
}

function renumberTasks() {
    const allTasks = document.querySelectorAll('#taskList li');

    allTasks.forEach(function(task, index) {
        const textSpan = task.querySelector('.taskText');
        const taskText = textSpan.textContent.substring(
            textSpan.textContent.indexOf(' ') + 1
        );
        textSpan.textContent = `${index + 1}. ${taskText}`;
    });
}

async function toDo() {
    const taskTitle = taskInputs.value.trim();

    if (taskTitle === '') {
        return;
    }

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: taskTitle
            })
        });

        if (response.ok) {
            const task = await response.json();
            createTaskElement(task);
            taskInputs.value = '';
        }
    } catch (error) {
        console.error('Could not add task:', error);
    }
}

addButtons.addEventListener('click', toDo);

taskInputs.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        toDo();
    }
});

loadTasks();
