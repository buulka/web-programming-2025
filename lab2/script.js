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

    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';

    const searchLabel = document.createElement('label');
    searchLabel.textContent = 'Поиск:';

    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'search-wrapper';

    const searchInput = document.createElement('input');
    searchInput.id = 'searchInput';
    searchInput.type = 'text';
    searchInput.placeholder = 'Введите название задачи...';

    const clearSearchBtn = document.createElement('button');
    clearSearchBtn.type = 'button';
    clearSearchBtn.className = 'clear-search-btn';
    clearSearchBtn.textContent = '×';
    clearSearchBtn.title = 'Сбросить поиск';
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        renderTTasks();
    });

    searchWrapper.append(searchInput, clearSearchBtn);
    searchLabel.append(searchWrapper);
    searchContainer.append(searchLabel);
    controls.append(searchContainer);

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

    const statusContainer = document.createElement('div');
    statusContainer.className = 'status-container';

    const statusLabel = document.createElement('label');
    statusLabel.textContent = 'Фильтр:';
    statusLabel.htmlFor = 'statusFilter';

    const statusSelect = document.createElement('select');
    statusSelect.id = 'statusFilter';

    [
        { value: 'all', text: 'Все задачи' },
        { value: 'active', text: 'Активные' },
        { value: 'completed', text: 'Выполненные' }
    ].forEach(({ value, text }) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        statusSelect.append(option);
    });

    statusLabel.append(statusSelect);
    statusContainer.append(statusLabel);
    controls.append(statusContainer);

    const listWrapper = document.createElement('section');
    listWrapper.className = 'list-wrapper';

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

    const table = document.createElement('table');
    table.className = 'tasks-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ["Статус", "Название", "Дата", "Действия"].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.append(th);
    });
    thead.append(headerRow);

    const tbody = document.createElement('tbody');
    table.append(thead, tbody);

    listWrapper.append(form, table);
    layout.append(controls, listWrapper);
    app.append(title, layout);
    document.body.append(app);

    const editModal = document.createElement('div');
    editModal.className = 'modal';
    editModal.id = 'editModal';

    const editModalContent = document.createElement('div');
    editModalContent.className = 'modal-content';

    const editModalHeader = document.createElement('div');
    editModalHeader.className = 'modal-header';

    const editModalTitle = document.createElement('h3');
    editModalTitle.textContent = 'Редактировать задачу';

    const editCloseBtn = document.createElement('span');
    editCloseBtn.className = 'close-btn';
    editCloseBtn.innerHTML = '&times;';
    editCloseBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
        editForm.reset();
        currentEditId = null;
    });

    editModalHeader.append(editModalTitle, editCloseBtn);

    const editModalBody = document.createElement('div');
    editModalBody.className = 'modal-body';

    const editForm = document.createElement('form');
    editForm.id = 'editForm';

    const editTextLabel = document.createElement('label');
    editTextLabel.textContent = 'Название задачи:';
    const editTextInput = document.createElement('input');
    editTextInput.type = 'text';
    editTextInput.id = 'editText';
    editTextInput.required = true;

    const editDateLabel = document.createElement('label');
    editDateLabel.textContent = 'Дата:';
    const editDateInput = document.createElement('input');
    editDateInput.type = 'date';
    editDateInput.id = 'editDate';
    editDateInput.required = true;

    const editModalFooter = document.createElement('div');
    editModalFooter.className = 'modal-footer';

    const saveEditBtn = document.createElement('button');
    saveEditBtn.type = 'submit';
    saveEditBtn.textContent = 'Сохранить';
    saveEditBtn.className = 'save-btn';

    const cancelEditBtn = document.createElement('button');
    cancelEditBtn.type = 'button';
    cancelEditBtn.textContent = 'Отмена';
    cancelEditBtn.className = 'cancel-btn';
    cancelEditBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
        editForm.reset();
        currentEditId = null;
    });

    editModalFooter.append(saveEditBtn, cancelEditBtn);

    editForm.append(editTextLabel, editTextInput, editDateLabel, editDateInput, editModalFooter);
    editModalBody.append(editForm);
    editModalContent.append(editModalHeader, editModalBody);
    editModal.append(editModalContent);
    document.body.append(editModal);

    const deleteModal = document.createElement('div');
    deleteModal.className = 'modal';
    deleteModal.id = 'deleteModal';

    const deleteModalContent = document.createElement('div');
    deleteModalContent.className = 'modal-content';

    const deleteModalHeader = document.createElement('div');
    deleteModalHeader.className = 'modal-header';

    const deleteModalTitle = document.createElement('h3');
    deleteModalTitle.textContent = 'Подтверждение удаления';

    const deleteCloseBtn = document.createElement('span');
    deleteCloseBtn.className = 'close-btn';
    deleteCloseBtn.innerHTML = '&times;';
    deleteCloseBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none';
        currentDeleteId = null;
    });

    deleteModalHeader.append(deleteModalTitle, deleteCloseBtn);

    const deleteModalBody = document.createElement('div');
    deleteModalBody.className = 'modal-body';
    deleteModalBody.textContent = 'Вы уверены, что хотите удалить эту задачу?';

    const deleteModalFooter = document.createElement('div');
    deleteModalFooter.className = 'modal-footer';

    const confirmDeleteBtn = document.createElement('button');
    confirmDeleteBtn.type = 'button';
    confirmDeleteBtn.textContent = 'Удалить';
    confirmDeleteBtn.className = 'delete-confirm-btn';
    confirmDeleteBtn.addEventListener('click', () => {
        if (currentDeleteId) {
            tasks = tasks.filter(task => task.id !== currentDeleteId);
            saveToLocalStorage();
            renderTasks();
            deleteModal.style.display = 'none';
            currentDeleteId = null;
        }
    });

    const cancelDeleteBtn = document.createElement('button');
    cancelDeleteBtn.type = 'button';
    cancelDeleteBtn.textContent = 'Отмена';
    cancelDeleteBtn.className = 'cancel-btn';
    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none';
        currentDeleteId = null;
    });

    deleteModalFooter.append(confirmDeleteBtn, cancelDeleteBtn);
    deleteModalContent.append(deleteModalHeader, deleteModalBody, deleteModalFooter);
    deleteModal.append(deleteModalContent);
    document.body.append(deleteModal);

    let tasks = [];
    let currentEditId = null;
    let currentDeleteId = null;

    function renderTasks() {
        tbody.innerHTML = "";

        const searchQuery = searchInput.value.toLowerCase().trim();
        const statusValue = statusSelect.value;
        const sortValue = sortSelect.value;

        let filteredTasks = tasks.filter(task =>
            task.text.toLowerCase().includes(searchQuery)
        );

        if (statusValue !== 'all') {
            filteredTasks = filteredTasks.filter(task =>
                statusValue === 'active' ? !task.completed : task.completed
            );
        }

        let sortedTasks = [...filteredTasks];
        if (sortValue !== 'none') {
            sortedTasks.sort((a, b) => {
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return sortValue === 'asc' ? dateA - dateB : dateB - dateA;
            });
        }

        let dragSrcIndex = null;

        sortedTasks.forEach((task, index) => {
            const row = document.createElement('tr');
            row.dataset.id = task.id;
            row.draggable = true;
            if (task.completed) row.classList.add('task-completed');

            row.addEventListener('dragstart', (e) => {
                dragSrcIndex = index;
                row.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            row.addEventListener('dragend', () => {
                row.classList.remove('dragging');
                [...tbody.querySelectorAll('tr')].forEach(r => r.classList.remove('drag-over'));
            });

            row.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                const rows = [...tbody.querySelectorAll('tr')];
                rows.forEach(r => r.classList.remove('drag-over'));
                row.classList.add('drag-over');
            });

            row.addEventListener('dragleave', () => {
                row.classList.remove('drag-over');
            });

            row.addEventListener('drop', (e) => {
                e.preventDefault();
                const dragOverIndex = index;
                if (dragSrcIndex === null || dragSrcIndex === dragOverIndex) return;
                const [movedTask] = tasks.splice(dragSrcIndex, 1);
                tasks.splice(dragOverIndex, 0, movedTask);
                saveToLocalStorage();
                renderTasks();
            });

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
            editBtn.title = 'Редактировать';
            editBtn.addEventListener('click', () => openEditModal(task.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '×';
            deleteBtn.className = 'delete-btn';
            deleteBtn.title = 'Удалить';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            actionsCell.append(editBtn, deleteBtn);
            row.append(statusCell, textCell, dateCell, actionsCell);
            tbody.append(row);
        });
    }


    function openEditModal(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            currentEditId = id;
            document.getElementById('editText').value = task.text;
            document.getElementById('editDate').value = task.date;
            editModal.style.display = 'flex';
        }
    }

    function deleteTask(id) {
        currentDeleteId = id;
        deleteModal.style.display = 'flex';
    }

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newText = document.getElementById('editText').value.trim();
        const newDate = document.getElementById('editDate').value;

        if (!newText || !newDate) {
            alert('Заполните все поля');
            return;
        }

        const task = tasks.find(t => t.id === currentEditId);
        if (task) {
            task.text = newText;
            task.date = newDate;
            saveToLocalStorage();
            renderTasks();
            editModal.style.display = 'none';
            currentEditId = null;
            editForm.reset();
        }
    });

    searchInput.addEventListener('input', renderTasks);
    clearSearchBtn.addEventListener('click', renderTasks);
    statusSelect.addEventListener('change', renderTasks);
    sortSelect.addEventListener('change', renderTasks);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!inputText.value.trim() || !inputDate.value) {
            alert('Заполните все поля');
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

    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            editModal.style.display = 'none';
            currentEditId = null;
            editForm.reset();
        }
        if (e.target === deleteModal) {
            deleteModal.style.display = 'none';
            currentDeleteId = null;
        }
    });

    function saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadFromLocalStorage() {
        const saved = localStorage.getItem('tasks');
        if (saved) {
            tasks = JSON.parse(saved);
        }
        renderTasks();
    }

    loadFromLocalStorage();
});
