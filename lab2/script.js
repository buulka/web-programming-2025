    document.addEventListener('DOMContentLoaded', () => {
        document.body.style.cssText = `
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #e0f2e9 0%, #d1d5db 100%);
            padding: 20px;
            margin: 0;
            min-height: 100vh;
            box-sizing: border-box;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .app {
                    margin: 10px !important;
                    border-radius: 15px !important;
                }

                .layout {
                    padding: 15px !important;
                }

                .controls {
                    flex-direction: column !important;
                    gap: 15px !important;
                    padding: 20px 15px !important;
                    margin-bottom: 20px !important;
                }

                .form {
                    flex-direction: column !important;
                    gap: 12px !important;
                    padding: 20px 15px !important;
                    margin-bottom: 20px !important;
                }

                .search-container,
                .sort-container,
                .status-container {
                    min-width: 100% !important;
                }

                .tasks-table th,
                .tasks-table td {
                    padding: 12px 10px !important;
                }

                .actions-cell button {
                    margin-left: 0 !important;
                    margin-right: 5px !important;
                }

                .modal-content {
                    width: 95% !important;
                    margin: 10px !important;
                }

                .modal-footer {
                    flex-direction: column-reverse !important;
                    gap: 10px !important;
                }

                .modal-footer button {
                    width: 100% !important;
                    margin: 0 !important;
                }
            }

            @media (max-width: 480px) {
                .title {
                    font-size: 1.8em !important;
                    padding: 20px 15px !important;
                }

                .tasks-table {
                    font-size: 13px !important;
                }

                .tasks-table th,
                .tasks-table td {
                    padding: 8px 6px !important;
                }

                .actions-cell {
                    display: flex !important;
                    flex-direction: row !important;
                    gap: 5px !important;
                }

                .actions-cell button {
                    padding: 6px 10px !important;
                    font-size: 12px !important;
                }

                .modal-header {
                    padding: 20px 20px 10px 20px !important;
                }

                .modal-body {
                    padding: 15px 20px !important;
                }

                .modal-footer {
                    padding: 15px 20px 20px 20px !important;
                }
            }

            @media (max-width: 360px) {
                .tasks-table {
                    display: block !important;
                    overflow-x: auto !important;
                    white-space: nowrap !important;
                }

                .actions-cell {
                    flex-direction: column !important;
                }

                .actions-cell button {
                    width: 100% !important;
                }
            }

            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);

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
            background: linear-gradient(135deg, #84a98c 0%, #52796f 100%);
            color: white;
            margin: 0;
            font-size: 2.2em;
            font-weight: 300;
            letter-spacing: 2px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
            background: rgba(228, 241, 234, 0.9);
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
            color: #2f3e46;
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
            border: 2px solid #cad2c5;
            border-radius: 10px;
            font-size: 14px;
            background: rgba(255, 255, 255, 0.9);
            transition: all 0.3s ease;
            box-sizing: border-box;
        `;

        searchInput.addEventListener('focus', () => {
            searchInput.style.borderColor = '#84a98c';
            searchInput.style.boxShadow = '0 0 0 3px rgba(132, 169, 140, 0.1)';
            searchInput.style.outline = 'none';
        });
        searchInput.addEventListener('blur', () => {
            searchInput.style.borderColor = '#cad2c5';
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
            color: #84a98c;
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
            clearSearchBtn.style.color = '#52796f';
            clearSearchBtn.style.background = 'rgba(82, 121, 111, 0.1)';
        });
        clearSearchBtn.addEventListener('mouseleave', () => {
            clearSearchBtn.style.color = '#84a98c';
            clearSearchBtn.style.background = 'none';
        });

        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            renderTasks();
        });

        searchWrapper.append(searchInput, clearSearchBtn);
        searchContainer.append(searchLabel, searchWrapper);
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
            color: #2f3e46;
            letter-spacing: 0.5px;
        `;

        const sortSelect = document.createElement('select');
        sortSelect.id = 'dateSort';
        sortSelect.style.cssText = `
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #cad2c5;
            border-radius: 10px;
            font-size: 14px;
            background: rgba(255, 255, 255, 0.9);
            cursor: pointer;
            transition: all 0.3s ease;
            box-sizing: border-box;
        `;

        sortSelect.addEventListener('focus', () => {
            sortSelect.style.borderColor = '#84a98c';
            sortSelect.style.boxShadow = '0 0 0 3px rgba(132, 169, 140, 0.1)';
            sortSelect.style.outline = 'none';
        });
        sortSelect.addEventListener('blur', () => {
            sortSelect.style.borderColor = '#cad2c5';
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

        sortContainer.append(sortLabel, sortSelect);
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
            color: #2f3e46;
            letter-spacing: 0.5px;
        `;

        const statusSelect = document.createElement('select');
        statusSelect.id = 'statusFilter';
        statusSelect.style.cssText = `
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #cad2c5;
            border-radius: 10px;
            font-size: 14px;
            background: rgba(255, 255, 255, 0.9);
            cursor: pointer;
            transition: all 0.3s ease;
            box-sizing: border-box;
        `;

        statusSelect.addEventListener('focus', () => {
            statusSelect.style.borderColor = '#84a98c';
            statusSelect.style.boxShadow = '0 0 0 3px rgba(132, 169, 140, 0.1)';
            statusSelect.style.outline = 'none';
        });
        statusSelect.addEventListener('blur', () => {
            statusSelect.style.borderColor = '#cad2c5';
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

        statusContainer.append(statusLabel, statusSelect);
        controls.append(statusContainer);

        const listWrapper = document.createElement('section');
        listWrapper.className = 'list-wrapper';
        listWrapper.style.cssText = `
            background: rgba(242, 248, 244, 0.8);
            border-radius: 15px;
            padding: 30px;
            border: 1px solid rgba(202, 210, 197, 0.8);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        `;

        const form = document.createElement("form");
        form.className = 'form';
        form.style.cssText = `
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
            flex-wrap: wrap;
            background: rgba(242, 248, 244, 0.7);
            padding: 25px;
            border-radius: 12px;
            border: 1px solid rgba(202, 210, 197, 0.5);
        `;

        const inputText = document.createElement("input");
        inputText.type = "text";
        inputText.placeholder = "Название задачи";
        inputText.required = true;
        inputText.style.cssText = `
            flex: 1;
            padding: 14px 18px;
            border: 2px solid #cad2c5;
            border-radius: 10px;
            min-width: 200px;
            font-size: 14px;
            background: rgba(255, 255, 255, 0.9);
            transition: all 0.3s ease;
            box-sizing: border-box;
        `;

        inputText.addEventListener('focus', () => {
            inputText.style.borderColor = '#84a98c';
            inputText.style.boxShadow = '0 0 0 3px rgba(132, 169, 140, 0.1)';
            inputText.style.outline = 'none';
        });
        inputText.addEventListener('blur', () => {
            inputText.style.borderColor = '#cad2c5';
            inputText.style.boxShadow = 'none';
        });

        const inputDate = document.createElement("input");
        inputDate.type = "date";
        inputDate.required = true;
        inputDate.style.cssText = `
            flex: 1;
            padding: 14px 18px;
            border: 2px solid #cad2c5;
            border-radius: 10px;
            min-width: 200px;
            font-size: 14px;
            background: rgba(255, 255, 255, 0.9);
            transition: all 0.3s ease;
            cursor: pointer;
            box-sizing: border-box;
        `;

        inputDate.addEventListener('focus', () => {
            inputDate.style.borderColor = '#84a98c';
            inputDate.style.boxShadow = '0 0 0 3px rgba(132, 169, 140, 0.1)';
            inputDate.style.outline = 'none';
        });
        inputDate.addEventListener('blur', () => {
            inputDate.style.borderColor = '#cad2c5';
            inputDate.style.boxShadow = 'none';
        });

        const addBtn = document.createElement("button");
        addBtn.type = "submit";
        addBtn.textContent = "Добавить";
        addBtn.style.cssText = `
            padding: 14px 30px;
            background: linear-gradient(135deg, #84a98c 0%, #52796f 100%);
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(82, 121, 111, 0.3);
            letter-spacing: 0.5px;
        `;

        addBtn.addEventListener('mouseenter', () => {
            addBtn.style.transform = 'translateY(-2px)';
            addBtn.style.boxShadow = '0 6px 20px rgba(82, 121, 111, 0.4)';
        });
        addBtn.addEventListener('mouseleave', () => {
            addBtn.style.transform = 'translateY(0)';
            addBtn.style.boxShadow = '0 4px 12px rgba(82, 121, 111, 0.3)';
        });

        form.append(inputText, inputDate, addBtn);

        const table = document.createElement('table');
        table.className = 'tasks-table';
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        `;

        const thead = document.createElement('thead');

        const headerRow = document.createElement('tr');
        headerRow.style.cssText = `
            background: linear-gradient(135deg, #e9f0ec 0%, #dde5e0 100%);
        `;

        ["Статус", "Название", "Дата", "Действия"].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            th.style.cssText = `
                padding: 15px 18px;
                text-align: center;
                font-weight: 600;
                color: #2f3e46;
                border-bottom: 2px solid #84a98c;
                font-size: 14px;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                background: rgba(233, 240, 236, 0.8);
            `;
            headerRow.append(th);
        });
        thead.append(headerRow);

        const tbody = document.createElement('tbody');
        tbody.style.cssText = `
            background: rgba(255, 255, 255, 0.98);
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
            border-bottom: 1px solid #e9f0ec;
        `;

        const editModalTitle = document.createElement('h3');
        editModalTitle.textContent = 'Редактировать задачу';
        editModalTitle.style.cssText = `
            margin: 0;
            font-size: 20px;
            color: #2f3e46;
            font-weight: 600;
            letter-spacing: 0.5px;
        `;

        const editCloseBtn = document.createElement('span');
        editCloseBtn.className = 'close-btn';
        editCloseBtn.textContent = '×';;
        editCloseBtn.style.cssText = `
            font-size: 28px;
            cursor: pointer;
            color: #84a98c;
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
            editCloseBtn.style.color = '#52796f';
            editCloseBtn.style.background = '#e9f0ec';
        });
        editCloseBtn.addEventListener('mouseleave', () => {
            editCloseBtn.style.color = '#84a98c';
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
            color: #2f3e46;
            letter-spacing: 0.3px;
        `;

        const editTextInput = document.createElement('input');
        editTextInput.type = 'text';
        editTextInput.id = 'editText';
        editTextInput.required = true;
        editTextInput.style.cssText = `
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #cad2c5;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 20px;
            background: rgba(255, 255, 255, 0.9);
            transition: all 0.3s ease;
            box-sizing: border-box;
        `;

        editTextInput.addEventListener('focus', () => {
            editTextInput.style.borderColor = '#84a98c';
            editTextInput.style.boxShadow = '0 0 0 3px rgba(132, 169, 140, 0.1)';
            editTextInput.style.outline = 'none';
        });
        editTextInput.addEventListener('blur', () => {
            editTextInput.style.borderColor = '#cad2c5';
            editTextInput.style.boxShadow = 'none';
        });

        const editDateLabel = document.createElement('label');
        editDateLabel.textContent = 'Дата:';
        editDateLabel.style.cssText = `
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
            color: #2f3e46;
            letter-spacing: 0.3px;
        `;

        const editDateInput = document.createElement('input');
        editDateInput.type = 'date';
        editDateInput.id = 'editDate';
        editDateInput.required = true;
        editDateInput.style.cssText = `
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #cad2c5;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 25px;
            background: rgba(255, 255, 255, 0.9);
            transition: all 0.3s ease;
            cursor: pointer;
            box-sizing: border-box;
        `;

        editDateInput.addEventListener('focus', () => {
            editDateInput.style.borderColor = '#84a98c';
            editDateInput.style.boxShadow = '0 0 0 3px rgba(132, 169, 140, 0.1)';
            editDateInput.style.outline = 'none';
        });
        editDateInput.addEventListener('blur', () => {
            editDateInput.style.borderColor = '#cad2c5';
            editDateInput.style.boxShadow = 'none';
        });

        const editModalFooter = document.createElement('div');
        editModalFooter.className = 'modal-footer';
        editModalFooter.style.cssText = `
            padding: 20px 25px 25px 25px;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            border-top: 1px solid #e9f0ec;
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
            background: linear-gradient(135deg, #84a98c 0%, #52796f 100%);
            color: white;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(82, 121, 111, 0.3);
            letter-spacing: 0.3px;
        `;

        saveEditBtn.addEventListener('mouseenter', () => {
            saveEditBtn.style.transform = 'translateY(-1px)';
            saveEditBtn.style.boxShadow = '0 6px 16px rgba(82, 121, 111, 0.4)';
        });
        saveEditBtn.addEventListener('mouseleave', () => {
            saveEditBtn.style.transform = 'translateY(0)';
            saveEditBtn.style.boxShadow = '0 4px 12px rgba(82, 121, 111, 0.3)';
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
            background: linear-gradient(135deg, #ff9999 0%, #ff6b6b 100%);
            color: #2f3e46;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(202, 210, 197, 0.3);
            letter-spacing: 0.3px;
        `;

        cancelEditBtn.addEventListener('mouseenter', () => {
            cancelEditBtn.style.transform = 'translateY(-1px)';
            cancelEditBtn.style.boxShadow = '0 6px 16px rgba(202, 210, 197, 0.4)';
        });
        cancelEditBtn.addEventListener('mouseleave', () => {
            cancelEditBtn.style.transform = 'translateY(0)';
            cancelEditBtn.style.boxShadow = '0 4px 12px rgba(202, 210, 197, 0.3)';
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
            border-bottom: 1px solid #e9f0ec;
        `;

        const deleteModalTitle = document.createElement('h3');
        deleteModalTitle.textContent = 'Подтверждение удаления';
        deleteModalTitle.style.cssText = `
            margin: 0;
            font-size: 20px;
            color: #84a98c;
            font-weight: 600;
            letter-spacing: 0.5px;
        `;

        const deleteCloseBtn = document.createElement('span');
        deleteCloseBtn.className = 'close-btn';
        deleteCloseBtn.textContent = '×';
        deleteCloseBtn.style.cssText = `
            font-size: 28px;
            cursor: pointer;
            color: #84a98c;
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
            deleteCloseBtn.style.color = '#52796f';
            deleteCloseBtn.style.background = '#e9f0ec';
        });
        deleteCloseBtn.addEventListener('mouseleave', () => {
            deleteCloseBtn.style.color = '#84a98c';
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
            color: #2f3e46;
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
            border-top: 1px solid #e9f0ec;
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
        background: linear-gradient(135deg, #84a98c 0%, #52796f 100%);
        color: white;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(82, 121, 111, 0.3);
        letter-spacing: 0.3px;
    `;

    confirmDeleteBtn.addEventListener('mouseenter', () => {
        confirmDeleteBtn.style.transform = 'translateY(-1px)';
        confirmDeleteBtn.style.boxShadow = '0 6px 16px rgba(82, 121, 111, 0.4)';
    });
    confirmDeleteBtn.addEventListener('mouseleave', () => {
        confirmDeleteBtn.style.transform = 'translateY(0)';
        confirmDeleteBtn.style.boxShadow = '0 4px 12px rgba(82, 121, 111, 0.3)';
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
        background: linear-gradient(135deg, #cad2c5 0%, #b7bfb2 100%);
        color: #2f3e46;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(202, 210, 197, 0.3);
        letter-spacing: 0.3px;
    `;

    cancelDeleteBtn.addEventListener('mouseenter', () => {
        cancelDeleteBtn.style.transform = 'translateY(-1px)';
        cancelDeleteBtn.style.boxShadow = '0 6px 16px rgba(202, 210, 197, 0.4)';
    });
    cancelDeleteBtn.addEventListener('mouseleave', () => {
        cancelDeleteBtn.style.transform = 'translateY(0)';
        cancelDeleteBtn.style.boxShadow = '0 4px 12px rgba(202, 210, 197, 0.3)';
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
        tbody.replaceChildren();

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
            border-bottom: 1px solid #cad2c5;

            @media (max-width: 768px) {
                cursor: default;
            }

            @media (max-width: 480px) {
                font-size: 13px;
            }
        `;

        if (task.completed) {
            row.style.cssText += `
                opacity: 0.6;
                background: rgba(233, 240, 236, 0.5);
            `;
        }

        row.addEventListener('mouseenter', () => {
            if (!task.completed) {
                row.style.background = 'rgba(228, 241, 234, 0.8)';
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
            if (window.innerWidth > 768) {
                dragSrcIndex = index;
                row.style.cssText += `
                    opacity: 0.5;
                    background-color: rgba(132, 169, 140, 0.2);
                    transform: scale(1.02);
                `;
                e.dataTransfer.effectAllowed = 'move';
            } else {
                e.preventDefault();
            }
        });

        row.addEventListener('dragend', () => {
            if (window.innerWidth > 768) {
                row.style.opacity = task.completed ? '0.6' : '1';
                row.style.background = task.completed ? 'rgba(233, 240, 236, 0.5)' : 'none';
                row.style.transform = 'scale(1)';
                [...tbody.querySelectorAll('tr')].forEach(r => {
                    r.style.borderTop = 'none';
                });
            }
        });

        row.addEventListener('dragover', (e) => {
            if (window.innerWidth > 768) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                const rows = [...tbody.querySelectorAll('tr')];
                rows.forEach(r => r.style.borderTop = 'none');
                row.style.borderTop = '3px solid #84a98c';
            }
        });

        row.addEventListener('dragleave', () => {
            if (window.innerWidth > 768) {
                row.style.borderTop = 'none';
            }
        });

        row.addEventListener('drop', (e) => {
            if (window.innerWidth > 768) {
                e.preventDefault();
                const dragOverIndex = index;
                if (dragSrcIndex === null || dragSrcIndex === dragOverIndex) return;
                const [movedTask] = tasks.splice(dragSrcIndex, 1);
                tasks.splice(dragOverIndex, 0, movedTask);
                saveToLocalStorage();
                renderTasks();
            }
        });

        const statusCell = document.createElement('td');
        statusCell.style.cssText = `
            padding: 15px 18px;
            text-align: center;
            vertical-align: middle;

            @media (max-width: 768px) {
                padding: 12px 10px;
            }

            @media (max-width: 480px) {
                padding: 8px 6px;
            }
        `;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.style.cssText = `
            width: 20px;
            height: 20px;
            cursor: pointer;
            accent-color: #84a98c;
            transform: scale(1.2);

            @media (max-width: 768px) {
                width: 18px;
                height: 18px;
                transform: scale(1);
            }

            @media (max-width: 480px) {
                width: 16px;
                height: 16px;
            }
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
            color: ${task.completed ? '#84a98c' : '#2f3e46'};
            text-decoration: ${task.completed ? 'line-through' : 'none'};
            font-weight: ${task.completed ? '400' : '500'};
            vertical-align: middle;
            text-align: center;
            word-break: break-word;

            @media (max-width: 768px) {
                padding: 12px 10px;
                font-size: 14px;
            }

            @media (max-width: 480px) {
                padding: 8px 6px;
                font-size: 13px;
            }
        `;

        const dateCell = document.createElement('td');
        dateCell.textContent = task.date;
        dateCell.style.cssText = `
            padding: 15px 18px;
            color: ${task.completed ? '#84a98c' : '#52796f'};
            text-decoration: ${task.completed ? 'line-through' : 'none'};
            font-size: 14px;
            vertical-align: middle;
            text-align: center;
            white-space: nowrap;

            @media (max-width: 768px) {
                padding: 12px 10px;
                font-size: 13px;
            }

            @media (max-width: 480px) {
                padding: 8px 6px;
                font-size: 12px;
            }
        `;

        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions-cell';
        actionsCell.style.cssText = `
            padding: 15px 18px;
            text-align: center;
            vertical-align: middle;

            @media (max-width: 768px) {
                padding: 12px 10px;
                white-space: nowrap;
            }

            @media (max-width: 480px) {
                padding: 8px 6px;
                display: flex;
                justify-content: center;
                flex-direction: row;
                gap: 5px;
            }

            @media (max-width: 360px) {
                flex-direction: column;
                align-items: center;
            }
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
            background: linear-gradient(135deg, #84a98c 0%, #52796f 100%);
            color: white;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(82, 121, 111, 0.3);

            @media (max-width: 768px) {
                padding: 6px 10px;
                margin-left: 5px;
                font-size: 14px;
                min-width: 36px;
            }

            @media (max-width: 480px) {
                padding: 8px 12px;
                margin-left: 0;
                flex: 1;
                font-size: 13px;
            }

            @media (max-width: 360px) {
                width: 100%;
                margin: 2px 0;
            }
        `;

        editBtn.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                editBtn.style.transform = 'translateY(-1px)';
                editBtn.style.boxShadow = '0 4px 12px rgba(82, 121, 111, 0.4)';
            }
        });
        editBtn.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                editBtn.style.transform = 'translateY(0)';
                editBtn.style.boxShadow = '0 2px 8px rgba(82, 121, 111, 0.3)';
            }
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
            background: linear-gradient(135deg, #ff9999 0%, #ff6b6b 100%);
            color: white;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(82, 121, 111, 0.3);

            @media (max-width: 768px) {
                padding: 6px 12px;
                margin-left: 5px;
                font-size: 16px;
                min-width: 36px;
            }

            @media (max-width: 480px) {
                padding: 8px 12px;
                margin-left: 0;
                flex: 1;
                font-size: 14px;
            }

            @media (max-width: 360px) {
                width: 100%;
                margin: 2px 0;
            }
        `;

        deleteBtn.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                deleteBtn.style.transform = 'translateY(-1px)';
                deleteBtn.style.boxShadow = '0 4px 12px rgba(82, 121, 111, 0.4)';
            }
        });
        deleteBtn.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                deleteBtn.style.transform = 'translateY(0)';
                deleteBtn.style.boxShadow = '0 2px 8px rgba(82, 121, 111, 0.3)';
            }
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