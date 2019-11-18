var handlers = {
  bindEvents: function() {
    var todosEl = document.querySelector(".todolist__todos");
    var EscapeKeyCode = 27;
    var EnterKeyCode = 13;

    // top bar evens listeners
    var formEl = document.querySelector(".todolist__form");
    formEl.addEventListener("submit", app.createTodoEl);

    var addIconEl = document.querySelector(".todolist__icon--add");
    addIconEl.addEventListener("click", app.createTodoEl);

    // buttons bar evens listeners
    var buttonsEl = document.querySelector(".todolist__buttons");
    buttonsEl.addEventListener("click", function(e) {
      var buttonEl = e.target.closest('button');
      if (buttonEl.classList.contains("todolist__button--completed")) {
        app.clearCompleted(todos.todosArr);
      }
      if (buttonEl.classList.contains("todolist__button--all")) {
        app.toggleAll();
      }
    });

    // todos evens listeners
    todosEl.addEventListener("click", function(e) {
      if (e.target.classList.contains("todolist__icon--delete")) {
        app.deleteTodo(e.target);
      }
      if (e.target.classList.contains("todolist__icon--plus")) {
        app.createSubTodoEl(e.target.parentElement);
      }
      if (e.target.classList.contains("todolist__checkbox")) {
        app.toggleTodo(e.target.parentElement);
      }
    });

    todosEl.addEventListener("dblclick", function(e) {
      app.setTodoToEditMode(e.target);
    });

    todosEl.addEventListener("focusout", function(e) {
      app.updateTodoTitle(e);
    });

    todosEl.addEventListener("keyup", function(e) {
      if (e.keyCode === EscapeKeyCode) {
        app.cancelUpdatingTitle(e);
      }
      if (e.keyCode === EnterKeyCode) {
        
        app.updateTodoTitle(e);
      }
    });
  }
};
