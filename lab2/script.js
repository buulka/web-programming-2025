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

    const list = document.createElement('ul');
    list.className = 'list';
    list.id = 'tasksList';

    const form = document.createElement("form");

    const inputText = document.createElement("input");
    inputText.type = "text";
    inputText.placeholder = "Название задачи";

    const inputDate = document.createElement("input");
    inputDate.type = "date";

    const addBtn = document.createElement("button");
    addBtn.textContent = "Добавить";

    listWrapper.append(listTitle, list);
    layout.append(controls, listWrapper);

    form.append(inputText, inputDate, addBtn);
    app.append(title, layout, form);

    document.body.append(app);

});