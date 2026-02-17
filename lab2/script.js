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

    ["Название", "Дата", "Действия"].forEach(text => {
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

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'editModal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    const modalTitle = document.createElement('h3');
    modalTitle.textContent = 'Редактировать задачу';

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        editForm.reset();
    });

    modalHeader.append(modalTitle, closeBtn);

    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';

    const editForm = document.createElement('form');
    editForm.id = 'editForm';

    const editTextLabel = document.createElement('label');
    editTextLabel.textContent = 'Название задачи:';
    editTextLabel.htmlFor = 'editText';

    const editTextInput = document.createElement('input');
    editTextInput.type = 'text';
    editTextInput.id = 'editText';
    editTextInput.required = true;

    const editDateLabel = document.createElement('label');
    editDateLabel.textContent = 'Дата:';
    editDateLabel.htmlFor = 'editDate';

    const editDateInput = document.createElement('input');
    editDateInput.type = 'date';
    editDateInput.id = 'editDate';
    editDateInput.required = true;

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'modal-footer';

    const saveBtn = document.createElement('button');
    saveBtn.type = 'submit';
    saveBtn.textContent = 'Сохранить';
    saveBtn.className = 'save-btn';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Отмена';
    cancelBtn.className = 'cancel-btn';
    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        editForm.reset();
    });

    buttonContainer.append(saveBtn, cancelBtn);

    editForm.append(editTextLabel, editTextInput, editDateLabel, editDateInput, buttonContainer);

    modalBody.append(editForm);
    modalContent.append(modalHeader, modalBody);
    modal.append(modalContent);
    document.body.append(modal);

    let tasks = [];
    let currentEditId = null;

    function deleteTask(id) {
        if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
            tasks = tasks.filter(task => task.id !== id);
            saveToLocalStorage();
            renderTasks();
        }
    }

    function openEditModal(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            currentEditId = id;
            editTextInput.value = task.text;
            editDateInput.value = task.date;
            modal.style.display = 'flex';
        }
    }

    function saveEdit(e) {
        e.preventDefault();

        const newText = editTextInput.value.trim();
        const newDate = editDateInput.value;

        if (!newText || !newDate) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        const task = tasks.find(t => t.id === currentEditId);
        if (task) {
            task.text = newText;
            task.date = newDate;
            saveToLocalStorage();
            renderTasks();
            modal.style.display = 'none';
            currentEditId = null;
            editForm.reset();
        }
    }

    function renderTasks() {
        tbody.innerHTML = "";

        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.dataset.id = task.id;

            const textCell = document.createElement('td');
            textCell.textContent = task.text;

            const dateCell = document.createElement('td');
            const date = new Date(task.date);
            dateCell.textContent = date.toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const actionsCell = document.createElement('td');
            actionsCell.className = 'actions-cell';

            const editBtn = document.createElement('button');
            editBtn.textContent = '✎';
            editBtn.className = 'edit-btn';
            editBtn.title = 'Редактировать задачу';
            editBtn.addEventListener('click', () => openEditModal(task.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '×';
            deleteBtn.className = 'delete-btn';
            deleteBtn.title = 'Удалить задачу';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            actionsCell.append(editBtn, deleteBtn);

            row.append(textCell, dateCell, actionsCell);
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

        if (!inputDate.value) {
            alert('Пожалуйста, выберите дату');
            return;
        }

        if (!inputText.value.trim()) {
            alert('Пожалуйста, введите название задачи');
            return;
        }

        const newTask = {
            id: Date.now(),
            text: inputText.value.trim(),
            date: inputDate.value,
        };

        tasks.push(newTask);
        saveToLocalStorage();
        renderTasks();
        form.reset();
    });

    editForm.addEventListener('submit', saveEdit);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            currentEditId = null;
            editForm.reset();
        }
    });

    loadFromLocalStorage();
    renderTasks();
});