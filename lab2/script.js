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

    const sortContainer = document.createElement('div');
    sortContainer.className = 'sort-container';

    const sortLabel = document.createElement('label');
    sortLabel.textContent = 'Сортировка по дате:';
    sortLabel.htmlFor = 'dateSort';

    const sortSelect = document.createElement('select');
    sortSelect.id = 'dateSort';

    [
        { value: 'none', text: 'Без сортировки' },
        { value: 'asc', text: 'Сначала старые' },
        { value: 'desc', text: 'Сначала новые' }
    ].forEach(({ value, text }) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        sortSelect.append(option);
    });

    sortLabel.append(sortSelect);
    sortContainer.append(sortLabel);
    controls.append(sortContainer);

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

    ["Статус", "Название", "Дата", "Действия"].forEach(text => {
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

    const deleteModal = document.createElement('div');
    deleteModal.className = 'modal';
    deleteModal.id = 'deleteModal';

    const deleteModalContent = document.createElement('div');
    deleteModalContent.className = 'modal-content delete-modal';

    const deleteModalHeader = document.createElement('div');
    deleteModalHeader.className = 'modal-header';

    const deleteModalTitle = document.createElement('h3');
    deleteModalTitle.textContent = 'Подтверждение удаления';

    const deleteCloseBtn = document.createElement('span');
    deleteCloseBtn.className = 'close-btn';
    deleteCloseBtn.innerHTML = '&times;';
    deleteCloseBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });

    deleteModalHeader.append(deleteModalTitle, deleteCloseBtn);

    const deleteModalBody = document.createElement('div');
    deleteModalBody.className = 'modal-body';
    deleteModalBody.innerHTML = '<p>Вы уверены, что хотите удалить эту задачу?</p>';

    const deleteModalFooter = document.createElement('div');
    deleteModalFooter.className = 'modal-footer';

    const confirmDeleteBtn = document.createElement('button');
    confirmDeleteBtn.type = 'button';
    confirmDeleteBtn.textContent = 'Удалить';
    confirmDeleteBtn.className = 'delete-confirm-btn';

    const cancelDeleteBtn = document.createElement('button');
    cancelDeleteBtn.type = 'button';
    cancelDeleteBtn.textContent = 'Отмена';
    cancelDeleteBtn.className = 'cancel-btn';
    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });

    deleteModalFooter.append(confirmDeleteBtn, cancelDeleteBtn);
    deleteModalContent.append(deleteModalHeader, deleteModalBody, deleteModalFooter);
    deleteModal.append(deleteModalContent);
    document.body.append(deleteModal);

    let tasks = [];
    let currentEditId = null;
    let currentDeleteId = null;

    function deleteTask(id) {
        currentDeleteId = id;
        deleteModal.style.display = 'flex';
    }

    confirmDeleteBtn.addEventListener('click', () => {
        if (currentDeleteId) {
            tasks = tasks.filter(task => task.id !== currentDeleteId);
            saveToLocalStorage();
            renderTasks();
            deleteModal.style.display = 'none';
            currentDeleteId = null;
        }
    });

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
        const sortValue = sortSelect.value;
        let sortedTasks = [...tasks];

        if (sortValue !== 'none') {
            sortedTasks.sort((a, b) => {
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return sortValue === 'asc' ? dateA - dateB : dateB - dateA;
            });
        }

        sortedTasks.forEach(task => {
            const row = document.createElement('tr');
            row.dataset.id = task.id;
            if (task.completed) row.classList.add('task-completed');

            const statusCell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                saveToLocalStorage();
                renderTasks();
            });
            statusCell.append(checkbox);

            const textCell = document.createElement('td');
            textCell.textContent = task.text;

            const dateCell = document.createElement('td');
            dateCell.textContent = task.date;

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
            row.append(statusCell, textCell, dateCell, actionsCell);
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
            completed: false
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
        if (e.target === deleteModal) {
            deleteModal.style.display = 'none';
            currentDeleteId = null;
        }
    });

    sortSelect.addEventListener('change', renderTasks);

    loadFromLocalStorage();
    renderTasks();
});
