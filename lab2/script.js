document.addEventListener('DOMContentLoaded', () => {
    const app = document.createElement('div');
    app.className = 'app';

    const title = document.createElement("h1");
    title.textContent = "ToDo List";

    app.append(title);
    document.body.append(app);
});