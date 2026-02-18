document.addEventListener('DOMContentLoaded', () => {
    document.body.style.cssText = `
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 20px;
        margin: 0;
        min-height: 100vh;
        box-sizing: border-box;
    `;

    const app = document.createElement('div');
    app.className = 'app';
    app.style.cssText = `
        max-width: 900px;
        margin: 0 auto;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        backdrop-filter: blur(10px);
    `;

    const title = document.createElement("h1");
    title.className = 'title';
    title.textContent = "ToDo List";
    title.style.cssText = `
        text-align: center;
        padding: 30px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        margin: 0;
        font-size: 2.2em;
        font-weight: 300;
        letter-spacing: 2px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    `;

    const layout = document.createElement('div');
    layout.className = 'layout';
    layout.style.cssText = `
        padding: 30px;
    `;

    const controls = document.createElement('section');
    controls.className = 'controls';
    controls.style.cssText = `
        display: flex;
        gap: 20px;
        margin-bottom: 30px;
        flex-wrap: wrap;
        background: rgba(255, 255, 255, 0.8);
        padding: 25px;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    `;

    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.cssText = `
        flex: 1;
        min-width: 200px;
    `;

    const searchLabel = document.createElement('label');
    searchLabel.textContent = 'Поиск:';
    searchLabel.style.cssText = `
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #6b7280;
        letter-spacing: 0.5px;
    `;

    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'search-wrapper';
    searchWrapper.style.cssText = `
        position: relative;
    `;

    const searchInput = document.createElement('input');
    searchInput.id = 'searchInput';
    searchInput.type = 'text';
    searchInput.placeholder = 'Введите название задачи...';
    searchInput.style.cssText = `
        width: 100%;
        padding: 12px 40px 12px 15px;
        border: 2px solid #e5e7eb;
        border-radius: 10px;
        font-size: 14px;
        background: rgba(255, 255, 255, 0.9);
        transition: all 0.3s ease;
        box-sizing: border-box;
    `;

    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = '#a78bfa';
        searchInput.style.boxShadow = '0 0 0 3px rgba(167, 139, 250, 0.1)';
        searchInput.style.outline = 'none';
    });
    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = '#e5e7eb';
        searchInput.style.boxShadow = 'none';
    });

    const clearSearchBtn = document.createElement('button');
    clearSearchBtn.type = 'button';
    clearSearchBtn.className = 'clear-search-btn';
    clearSearchBtn.textContent = '×';
    clearSearchBtn.title = 'Сбросить поиск';
    clearSearchBtn.style.cssText = `
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #9ca3af;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
    `;

    clearSearchBtn.addEventListener('mouseenter', () => {
        clearSearchBtn.style.color = '#6b7280';
        clearSearchBtn.style.background = 'rgba(107, 114, 128, 0.1)';
    });
    clearSearchBtn.addEventListener('mouseleave', () => {
        clearSearchBtn.style.color = '#9ca3af';
        clearSearchBtn.style.background = 'none';
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        renderTasks();
    });

    searchWrapper.append(searchInput, clearSearchBtn);
    searchLabel.append(searchWrapper);
    searchContainer.append(searchLabel);
    controls.append(searchContainer);

    const sortContainer = document.createElement('div');
    sortContainer.className = 'sort-container';
    sortContainer.style.cssText = `
        flex: 1;
        min-width: 200px;
    `;

    const sortLabel = document.createElement('label');
    sortLabel.textContent = 'Сортировка по дате:';
    sortLabel.htmlFor = 'dateSort';
    sortLabel.style.cssText = `
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #6b7280;
        letter-spacing: 0.5px;
    `;

    const sortSelect = document.createElement('select');
    sortSelect.id = 'dateSort';
    sortSelect.style.cssText = `
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #e5e7eb;
        border-radius: 10px;
        font-size: 14px;
        background: rgba(255, 255, 255, 0.9);
        cursor: pointer;
        transition: all 0.3s ease;
        box-sizing: border-box;
    `;

    sortSelect.addEventListener('focus', () => {
        sortSelect.style.borderColor = '#a78bfa';
        sortSelect.style.boxShadow = '0 0 0 3px rgba(167, 139, 250, 0.1)';
        sortSelect.style.outline = 'none';
    });
    sortSelect.addEventListener('blur', () => {
        sortSelect.style.borderColor = '#e5e7eb';
        sortSelect.style.boxShadow = 'none';
    });

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
    statusContainer.style.cssText = `
        flex: 1;
        min-width: 200px;
    `;

    const statusLabel = document.createElement('label');
    statusLabel.textContent = 'Фильтр:';
    statusLabel.htmlFor = 'statusFilter';
    statusLabel.style.cssText = `
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #6b7280;
        letter-spacing: 0.5px;
    `;

    const statusSelect = document.createElement('select');
    statusSelect.id = 'statusFilter';
    statusSelect.style.cssText = `
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #e5e7eb;
        border-radius: 10px;
        font-size: 14px;
        background: rgba(255, 255, 255, 0.9);
        cursor: pointer;
        transition: all 0.3s ease;
        box-sizing: border-box;
    `;

    statusSelect.addEventListener('focus', () => {
        statusSelect.style.borderColor = '#a78bfa';
        statusSelect.style.boxShadow = '0 0 0 3px rgba(167, 139, 250, 0.1)';
        statusSelect.style.outline = 'none';
    });
    statusSelect.addEventListener('blur', () => {
        statusSelect.style.borderColor = '#e5e7eb';
        statusSelect.style.boxShadow = 'none';
    });

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
    listWrapper.style.cssText = `
        background: rgba(248, 250, 252, 0.8);
        border-radius: 15px;
        padding: 30px;
        border: 1px solid rgba(226, 232, 240, 0.8);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    `;

    const form = document.createElement("form");
    form.style.cssText = `
        display: flex;
        gap: 15px;
        margin-bottom: 30px;
        flex-wrap: wrap;
        background: rgba(255, 255, 255, 0.7);
        padding: 25px;
        border-radius: 12px;
        border: 1px solid rgba(203, 213, 225, 0.5);
    `;

    const inputText = document.createElement("input");
    inputText.type = "text";
    inputText.placeholder = "Название задачи";
    inputText.required = true;
    inputText.style.cssText = `
        flex: 1;
        padding: 14px 18px;
        border: 2px solid #e2e8f0;
        border-radius: 10px;
        min-width: 200px;
        font-size: 14px;
        background: rgba(255, 255, 255, 0.9);
        transition: all 0.3s ease;
        box-sizing: border-box;
    `;

    inputText.addEventListener('focus', () => {
        inputText.style.borderColor = '#a78bfa';
        inputText.style.boxShadow = '0 0 0 3px rgba(167, 139, 250, 0.1)';
        inputText.style.outline = 'none';
    });
    inputText.addEventListener('blur', () => {
        inputText.style.borderColor = '#e2e8f0';
        inputText.style.boxShadow = 'none';
    });

    const inputDate = document.createElement("input");
    inputDate.type = "date";
    inputDate.required = true;
    inputDate.style.cssText = `
        flex: 1;
        padding: 14px 18px;
        border: 2px solid #e2e8f0;
        border-radius: 10px;
        min-width: 200px;
        font-size: 14px;
        background: rgba(255, 255, 255, 0.9);
        transition: all 0.3s ease;
        cursor: pointer;
        box-sizing: border-box;
    `;

    inputDate.addEventListener('focus', () => {
        inputDate.style.borderColor = '#a78bfa';
        inputDate.style.boxShadow = '0 0 0 3px rgba(167, 139, 250, 0.1)';
        inputDate.style.outline = 'none';
    });
    inputDate.addEventListener('blur', () => {
        inputDate.style.borderColor = '#e2e8f0';
        inputDate.style.boxShadow = 'none';
    });

    const addBtn = document.createElement("button");
    addBtn.type = "submit";
    addBtn.textContent = "Добавить";
    addBtn.style.cssText = `
        padding: 14px 30px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        letter-spacing: 0.5px;
    `;

    addBtn.addEventListener('mouseenter', () => {
        addBtn.style.transform = 'translateY(-2px)';
        addBtn.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
    });
    addBtn.addEventListener('mouseleave', () => {
        addBtn.style.transform = 'translateY(0)';
        addBtn.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
    });

    form.append(inputText, inputDate, addBtn);

    const table = document.createElement('table');
    table.className = 'tasks-table';
    table.style.cssText = `
        width: 100%;
        border-collapse: collapse;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    `;

    const thead = document.createElement('thead');

    const headerRow = document.createElement('tr');
    headerRow.style.cssText = `
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    `;

    ["Статус", "Название", "Дата", "Действия"].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.cssText = `
            padding: 15px 18px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #d1d5db;
            font-size: 14px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            background: rgba(249, 250, 251, 0.8);
        `;
        headerRow.append(th);
    });
    thead.append(headerRow);

    const tbody = document.createElement('tbody');
    tbody.style.cssText = `
        background: rgba(255, 255, 255, 0.95);
    `;

    table.append(thead, tbody);

    listWrapper.append(form, table);
    layout.append(controls, listWrapper);
    app.append(title, layout);
    document.body.append(app);

    const editModal = document.createElement('div');
    editModal.className = 'modal';
    editModal.id = 'editModal';
    editModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
    `;

    const editModalContent = document.createElement('div');
    editModalContent.className = 'modal-content';
    editModalContent.style.cssText = `
        background: white;
        padding: 0;
        border-radius: 15px;
        max-width: 450px;
        width: 90%;
        max-height: 90vh;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: modalFadeIn 0.3s ease;
    `;

    const editModalHeader = document.createElement('div');
    editModalHeader.className = 'modal-header';
    editModalHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 25px 25px 15px 25px;
        border-bottom: 1px solid #f1f5f9;
    `;

    const editModalTitle = document.createElement('h3');
    editModalTitle.textContent = 'Редактировать задачу';
    editModalTitle.style.cssText = `
        margin: 0;
        font-size: 20px;
        color: #1f2937;
        font-weight: 600;
        letter-spacing: 0.5px;
    `;

    const editCloseBtn = document.createElement('span');
    editCloseBtn.className = 'close-btn';
    editCloseBtn.innerHTML = '&times;';
    editCloseBtn.style.cssText = `
        font-size: 28px;
        cursor: pointer;
        color: #9ca3af;
        padding: 8px;
        line-height: 1;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: all 0.2s ease;
    `;

    editCloseBtn.addEventListener('mouseenter', () => {
        editCloseBtn.style.color = '#374151';
        editCloseBtn.style.background = '#f3f4f6';
    });
    editCloseBtn.addEventListener('mouseleave', () => {
        editCloseBtn.style.color = '#9ca3af';
        editCloseBtn.style.background = 'none';
    });

    editCloseBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
        editForm.reset();
        currentEditId = null;
    });

    editModalHeader.append(editModalTitle, editCloseBtn);

    const editModalBody = document.createElement('div');
    editModalBody.className = 'modal-body';
    editModalBody.style.cssText = `
        padding: 20px 25px;
    `;

    const editForm = document.createElement('form');
    editForm.id = 'editForm';

    const editTextLabel = document.createElement('label');
    editTextLabel.textContent = 'Название задачи:';
    editTextLabel.style.cssText = `
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        letter-spacing: 0.3px;
    `;

    const editTextInput = document.createElement('input');
    editTextInput.type = 'text';
    editTextInput.id = 'editText';
    editTextInput.required = true;
    editTextInput.style.cssText = `
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        margin-bottom: 20px;
        background: rgba(255, 255, 255, 0.9);
        transition: all 0.3s ease;
        box-sizing: border-box;
    `;

    editTextInput.addEventListener('focus', () => {
        editTextInput.style.borderColor = '#a78bfa';
        editTextInput.style.boxShadow = '0 0 0 3px rgba(167, 139, 250, 0.1)';
        editTextInput.style.outline = 'none';
    });
    editTextInput.addEventListener('blur', () => {
        editTextInput.style.borderColor = '#e5e7eb';
        editTextInput.style.boxShadow = 'none';
    });

    const editDateLabel = document.createElement('label');
    editDateLabel.textContent = 'Дата:';
    editDateLabel.style.cssText = `
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        letter-spacing: 0.3px;
    `;

    const editDateInput = document.createElement('input');
    editDateInput.type = 'date';
    editDateInput.id = 'editDate';
    editDateInput.required = true;
    editDateInput.style.cssText = `
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        margin-bottom: 25px;
        background: rgba(255, 255, 255, 0.9);
        transition: all 0.3s ease;
        cursor: pointer;
        box-sizing: border-box;
    `;

    editDateInput.addEventListener('focus', () => {
        editDateInput.style.borderColor = '#a78bfa';
        editDateInput.style.boxShadow = '0 0 0 3px rgba(167, 139, 250, 0.1)';
        editDateInput.style.outline = 'none';
    });
    editDateInput.addEventListener('blur', () => {
        editDateInput.style.borderColor = '#e5e7eb';
        editDateInput.style.boxShadow = 'none';
    });

    const editModalFooter = document.createElement('div');
    editModalFooter.className = 'modal-footer';
    editModalFooter.style.cssText = `
        padding: 20px 25px 25px 25px;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        border-top: 1px solid #f1f5f9;
    `;

    const saveEditBtn = document.createElement('button');
    saveEditBtn.type = 'submit';
    saveEditBtn.textContent = 'Сохранить';
    saveEditBtn.className = 'save-btn';
    saveEditBtn.style.cssText = `
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        letter-spacing: 0.3px;
    `;

    saveEditBtn.addEventListener('mouseenter', () => {
        saveEditBtn.style.transform = 'translateY(-1px)';
        saveEditBtn.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
    });
    saveEditBtn.addEventListener('mouseleave', () => {
        saveEditBtn.style.transform = 'translateY(0)';
        saveEditBtn.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
    });

    const cancelEditBtn = document.createElement('button');
    cancelEditBtn.type = 'button';
    cancelEditBtn.textContent = 'Отмена';
    cancelEditBtn.className = 'cancel-btn';
    cancelEditBtn.style.cssText = `
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
        color: white;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
        letter-spacing: 0.3px;
    `;

    cancelEditBtn.addEventListener('mouseenter', () => {
        cancelEditBtn.style.transform = 'translateY(-1px)';
        cancelEditBtn.style.boxShadow = '0 6px 16px rgba(107, 114, 128, 0.4)';
    });
    cancelEditBtn.addEventListener('mouseleave', () => {
        cancelEditBtn.style.transform = 'translateY(0)';
        cancelEditBtn.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.3)';
    });

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

    // Модальное окно удаления
    const deleteModal = document.createElement('div');
    deleteModal.className = 'modal';
    deleteModal.id = 'deleteModal';
    deleteModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
    `;

    const deleteModalContent = document.createElement('div');
    deleteModalContent.className = 'modal-content';
    deleteModalContent.style.cssText = `
        background: white;
        padding: 0;
        border-radius: 15px;
        max-width: 400px;
        width: 90%;
        max-height: 90vh;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: modalFadeIn 0.3s ease;
    `;

    const deleteModalHeader = document.createElement('div');
    deleteModalHeader.className = 'modal-header';
    deleteModalHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 25px 25px 15px 25px;
        border-bottom: 1px solid #f1f5f9;
    `;

    const deleteModalTitle = document.createElement('h3');
    deleteModalTitle.textContent = 'Подтверждение удаления';
    deleteModalTitle.style.cssText = `
        margin: 0;
        font-size: 20px;
        color: #dc2626;
        font-weight: 600;
        letter-spacing: 0.5px;
    `;

    const deleteCloseBtn = document.createElement('span');
    deleteCloseBtn.className = 'close-btn';
    deleteCloseBtn.innerHTML = '&times;';
    deleteCloseBtn.style.cssText = `
        font-size: 28px;
        cursor: pointer;
        color: #9ca3af;
        padding: 8px;
        line-height: 1;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: all 0.2s ease;
    `;

    deleteCloseBtn.addEventListener('mouseenter', () => {
        deleteCloseBtn.style.color = '#374151';
        deleteCloseBtn.style.background = '#f3f4f6';
    });
    deleteCloseBtn.addEventListener('mouseleave', () => {
        deleteCloseBtn.style.color = '#9ca3af';
        deleteCloseBtn.style.background = 'none';
    });

    deleteCloseBtn.addEventListener('click', () => {
        deleteModal.style.display = 'none';
        currentDeleteId = null;
    });

    deleteModalHeader.append(deleteModalTitle, deleteCloseBtn);

    const deleteModalBody = document.createElement('div');
    deleteModalBody.className = 'modal-body';
    deleteModalBody.textContent = 'Вы уверены, что хотите удалить эту задачу?';
    deleteModalBody.style.cssText = `
        padding: 20px 25px;
        color: #4b5563;
        line-height: 1.6;
        font-size: 16px;
        text-align: center;
    `;

    const deleteModalFooter = document.createElement('div');
    deleteModalFooter.className = 'modal-footer';
    deleteModalFooter.style.cssText = `
        padding: 20px 25px 25px 25px;
        display: flex;
        gap: 12px;
        justify-content: center;
        border-top: 1px solid #f1f5f9;
    `;

const confirmDeleteBtn = document.createElement('button');
confirmDeleteBtn.type = 'button';
confirmDeleteBtn.textContent = 'Удалить';
confirmDeleteBtn.className = 'delete-confirm-btn';
confirmDeleteBtn.style.cssText = `
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    color: white;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    letter-spacing: 0.3px;
`;

confirmDeleteBtn.addEventListener('mouseenter', () => {
    confirmDeleteBtn.style.transform = 'translateY(-1px)';
    confirmDeleteBtn.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.4)';
});
confirmDeleteBtn.addEventListener('mouseleave', () => {
    confirmDeleteBtn.style.transform = 'translateY(0)';
    confirmDeleteBtn.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
});

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
cancelDeleteBtn.style.cssText = `
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    color: white;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
    letter-spacing: 0.3px;
`;

cancelDeleteBtn.addEventListener('mouseenter', () => {
    cancelDeleteBtn.style.transform = 'translateY(-1px)';
    cancelDeleteBtn.style.boxShadow = '0 6px 16px rgba(107, 114, 128, 0.4)';
});
cancelDeleteBtn.addEventListener('mouseleave', () => {
    cancelDeleteBtn.style.transform = 'translateY(0)';
    cancelDeleteBtn.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.3)';
});

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
        row.style.cssText = `
            transition: all 0.2s ease;
            cursor: grab;
            border-bottom: 1px solid #f1f5f9;
        `;

        if (task.completed) {
            row.style.cssText += `
                opacity: 0.6;
                background: rgba(243, 244, 246, 0.5);
            `;
        }

        row.addEventListener('mouseenter', () => {
            if (!task.completed) {
                row.style.background = 'rgba(249, 250, 251, 0.8)';
                row.style.transform = 'translateY(-1px)';
            }
        });
        row.addEventListener('mouseleave', () => {
            if (!task.completed) {
                row.style.background = 'none';
                row.style.transform = 'translateY(0)';
            }
        });

        row.addEventListener('dragstart', (e) => {
            dragSrcIndex = index;
            row.style.cssText += `
                opacity: 0.5;
                background-color: rgba(224, 247, 250, 0.8);
                transform: scale(1.02);
            `;
            e.dataTransfer.effectAllowed = 'move';
        });

        row.addEventListener('dragend', () => {
            row.style.opacity = task.completed ? '0.6' : '1';
            row.style.background = task.completed ? 'rgba(243, 244, 246, 0.5)' : 'none';
            row.style.transform = 'scale(1)';
            [...tbody.querySelectorAll('tr')].forEach(r => {
                r.style.borderTop = 'none';
            });
        });

        row.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            const rows = [...tbody.querySelectorAll('tr')];
            rows.forEach(r => r.style.borderTop = 'none');
            row.style.borderTop = '3px solid #a78bfa';
        });

        row.addEventListener('dragleave', () => {
            row.style.borderTop = 'none';
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
        statusCell.style.cssText = `
            padding: 15px 18px;
            text-align: center;
            vertical-align: middle;
        `;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.style.cssText = `
            width: 20px;
            height: 20px;
            cursor: pointer;
            accent-color: #a78bfa;
            transform: scale(1.2);
        `;
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            saveToLocalStorage();
            renderTasks();
        });
        statusCell.append(checkbox);

        const textCell = document.createElement('td');
        textCell.textContent = task.text;
        textCell.style.cssText = `
            padding: 15px 18px;
            color: ${task.completed ? '#9ca3af' : '#374151'};
            text-decoration: ${task.completed ? 'line-through' : 'none'};
            font-weight: ${task.completed ? '400' : '500'};
            vertical-align: middle;
        `;

        const dateCell = document.createElement('td');
        dateCell.textContent = task.date;
        dateCell.style.cssText = `
            padding: 15px 18px;
            color: ${task.completed ? '#9ca3af' : '#6b7280'};
            text-decoration: ${task.completed ? 'line-through' : 'none'};
            font-size: 14px;
            vertical-align: middle;
        `;

        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions-cell';
        actionsCell.style.cssText = `
            padding: 15px 18px;
            text-align: right;
            vertical-align: middle;
        `;

        const editBtn = document.createElement('button');
        editBtn.textContent = '✎';
        editBtn.className = 'edit-btn';
        editBtn.title = 'Редактировать';
        editBtn.style.cssText = `
            padding: 8px 12px;
            margin-left: 8px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        `;

        editBtn.addEventListener('mouseenter', () => {
            editBtn.style.transform = 'translateY(-1px)';
            editBtn.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
        });
        editBtn.addEventListener('mouseleave', () => {
            editBtn.style.transform = 'translateY(0)';
            editBtn.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
        });

        editBtn.addEventListener('click', () => openEditModal(task.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.className = 'delete-btn';
        deleteBtn.title = 'Удалить';
        deleteBtn.style.cssText = `
            padding: 8px 12px;
            margin-left: 8px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        `;

        deleteBtn.addEventListener('mouseenter', () => {
            deleteBtn.style.transform = 'translateY(-1px)';
            deleteBtn.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
        });
        deleteBtn.addEventListener('mouseleave', () => {
            deleteBtn.style.transform = 'translateY(0)';
            deleteBtn.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
        });

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
