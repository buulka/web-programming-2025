document.addEventListener('DOMContentLoaded', () => {
    const app = document.createElement('div');
    app.className = 'app';

    const title = document.createElement("h1");
    title.className = 'title';
    title.textContent = "ToDo List";

    const layout = document.createElement('div');
    layout.className = 'layout';

    const controls = document.createElement('section');
    controls.className = 'controls';
    controls.setAttribute('aria-label', 'Task controls');

    const listWrapper = document.createElement('section');
    listWrapper.className = 'list-wrapper';
    listWrapper.setAttribute('aria-label', 'Task list');

    const listTitle = document.createElement('h2');
    listTitle.textContent = 'Tasks';

    const table = document.createElement('table');
    table.className = 'tasks-table';
    table.id = 'tasksTable';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    ["Название", "Дата"].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.append(th);
    });

    thead.append(headerRow);

    const tbody = document.createElement('tbody');
    tbody.id = 'tasksBody';

    table.append(thead, tbody);

    const form = document.createElement("form");

    const inputText = document.createElement("input");
    inputText.type = "text";
    inputText.placeholder = "Название задачи";
    inputText.required = true;

    const inputDate = document.createElement("input");
    inputDate.type = "date";
    inputDate.required = true;

    const addBtn = document.createElement("button");
    addBtn.type = "submit";
    addBtn.textContent = "Добавить";

    form.append(inputText, inputDate, addBtn);

    listWrapper.append(listTitle, form, table);
    layout.append(controls, listWrapper);
    app.append(title, layout);
    document.body.append(app);

    let tasks = []

    function renderTasks() {
        tbody.innerHTML = "";

        tasks.forEach(task => {
            const row = document.createElement('tr');

            const textCell = document.createElement('td');
            textCell.textContent = task.text;

            const dateCell = document.createElement('td');
            dateCell.textContent = task.date;

            const actionsCell = document.createElement('td');

            row.append(textCell, dateCell);
            tbody.append(row);
        });
    }

    function saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadFromLocalStorage() {
        const saved = localStorage.getItem('tasks');
        if (saved) {
            tasks = JSON.parse(saved);
            renderTasks();
        }
    }



    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const newTask = {
            id: Date.now(),
            text: inputText.value,
            date: inputDate.value,
        };

        tasks.push(newTask);
        saveToLocalStorage();
        renderTasks();
        form.reset();
    });

    loadFromLocalStorage();
    renderTasks();

});
