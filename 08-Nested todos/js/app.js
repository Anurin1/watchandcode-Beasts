var app = {
  init: function() {
    // get data from storage
    var data = todos.getTodosFromStorage() || [];
    todos.todosArr = data;

    // render data
    this.renderDataFromStorage(data);

    //bind event handlers
    handlers.bindEvents();
  },
  createTodoEl: function(e) {
    // prevent from submiting
    e.preventDefault();

    // get the input value
    var inputEl = document.querySelector(".todolist__input");
    var inputValue = inputEl.value;

    if (inputValue.length === 0) {
      return;
    }

    // create todo element
    var todoEl = document.createElement("li");
    todoEl.innerHTML = elementTemplates.getTodoTemplate(inputValue);
    todoEl.classList.add("todolist__todo");

    // set unique id
    var todoId = todos.getUniqueId();
    todoEl.setAttribute("data-id", todoId);

    // create todo item
    todos.createTodoItem(inputValue, todoId);

    // prepend todo element
    var formEl = document.querySelector(".todolist__todos");
    formEl.prepend(todoEl);

    // clear input
    inputEl.value = "";

    // save any changes
    todos.saveTodosToStorage();
  },

  createSubTodoEl: function(todoEl) {
    // create new subtodo element
    var subTodoEl = document.createElement("li");
    subTodoEl.innerHTML = elementTemplates.getTodoTemplate("");
    subTodoEl.classList.add("todolist__todo", "is-subtodo");

    // set unique subtodo id
    var subTodoId = todos.getUniqueId();
    subTodoEl.setAttribute("data-id", subTodoId);

    // get cliked todo's id
    todoId = todoEl.getAttribute("data-id");

    // get clicked todo item
    var todoItem = todos.getTodoItem(todos.todosArr, todoId);

    // create new ul element if todo element has no subtodos
    if (todoItem.subtodoArr.length === 0) {
      var ulEl = document.createElement("ul");
      todoEl.insertAdjacentElement("afterend", ulEl);
    }

    // create subTodo item
    todos.createSubTodoItem(subTodoId, todoId, todoItem);

    // select ul element and prepend subtodo element
    var ulEl = todoEl.nextElementSibling;
    ulEl.prepend(subTodoEl);

    // select subtodo's label element and set it to edit mode
    var labelEl = subTodoEl.querySelector(".todolist__todo-label");
    this.setTodoToEditMode(labelEl);

    // save any changes
    todos.saveTodosToStorage();
  },

  setTodoToEditMode: function(el) {
    // el has to be label element
    if (!el.classList.contains("todolist__todo-label")) {
      return;
    }

    var labelValue = el.textContent;
    var inputEl = el.previousElementSibling;
    var liEl = el.parentElement;
    var iconEls = liEl.querySelectorAll(".todolist__icon");

    // set to edit mode
    liEl.classList.add("is-editing");

    //show hidden input element, hide label element, hide icons
    inputEl.classList.remove("is-hidden");
    el.classList.add("is-hidden");
    iconEls.forEach(function(el) {
      el.classList.add("is-hidden");
    });

    // set input value to the label text content and give input focus
    inputEl.value = labelValue;
    inputEl.focus();
  },
  updateTodoTitle: function(e) {
    var el = e.target;

    if (!el.parentElement.classList.contains("is-editing")) {
      return;
    }

    var updatedValue = el.value;
    var labelEl = el.nextElementSibling;
    var liEl = el.parentElement;

    // get todo id
    todoId = liEl.getAttribute("data-id");

    // get todo item
    var todoItem = todos.getTodoItem(todos.todosArr, todoId);

    //if during creating new subtodo, the esc key has been pressed, todo item has already been deleted, return
    if (todoItem === undefined) {
      return;
    }

    //if during creating new subtodo, the title is empty, delete this subtodo
    if (updatedValue === "") {
      this.deleteSubtodoElWhileCreating(todoItem, liEl);
      return;
    }

    // if esc key has been pressed during creating new subtodo, the todo item has been deleted and there is no title to update
    if (todoItem !== undefined) {
      // update todo item title
      todoItem.title = updatedValue;

      // update label element text content
      labelEl.textContent = updatedValue;

      //remove edit mode
      this.removeEditMode(el);

      //save any changes
      todos.saveTodosToStorage();
    }
  },
  removeEditMode: function(el) {
    var labelEl = el.nextElementSibling;
    var liEl = el.parentElement;
    var iconEls = liEl.querySelectorAll(".todolist__icon");

    // hide input element
    el.classList.add("is-hidden");

    //show label element with updated description

    labelEl.classList.remove("is-hidden");

    //show icons
    iconEls.forEach(function(el) {
      el.classList.remove("is-hidden");
    });

    liEl.classList.remove("is-editing");
  },
  deleteSubtodoElWhileCreating: function(subTodoItem, liEl) {
    // get todo item
    var todoId = subTodoItem.parentId;
    var todoItem = todos.getTodoItem(todos.todosArr, todoId);

    //delete subtodo item
    todos.deleteTodo(todoItem, subTodoItem);

    //delete todo element
    todoEl = document.querySelector(`li[data-id="${todoId}"]`);
    todoEl.nextElementSibling.removeChild(liEl);

    //save any changes
    todos.saveTodosToStorage();
  },

  cancelUpdatingTitle: function(e) {
    el = e.target;
    liEl = el.parentElement;

    if (!liEl.classList.contains("is-editing")) {
      return;
    }
    //find todo item
    var todoId = liEl.getAttribute("data-id");
    var todoItem = todos.getTodoItem(todos.todosArr, todoId);

    // if todo doesnt not have title, delete it, otherwise restore its title value
    if (todoItem.title === null) {
      this.deleteSubtodoElWhileCreating(todoItem, liEl);
    } else {
      this.removeEditMode(el);
    }
  },

  deleteTodo: function(el) {
    if (!el.classList.contains("todolist__icon--delete")) {
      return;
    }
    var todoEl = el.parentElement;

    //get todo item
    todoId = todoEl.getAttribute("data-id");
    var todoItem = todos.getTodoItem(todos.todosArr, todoId);

    //get parent todo item
    parentTodoId = todoItem.parentId;
    var parentTodoItem = todos.getTodoItem(todos.todosArr, parentTodoId);

    //delete todo item
    todos.deleteTodo(parentTodoItem, todoItem);

    //delete todo's all subtodos elements
    if (todoItem.subtodoArr.length !== 0) {
      todoEl.nextElementSibling.remove();
    }

    //delete todo element
    todoEl.remove();

    //save any changes
    todos.saveTodosToStorage();
  },

  renderDataFromStorage: function(arr) {
    for (var i = 0; i < arr.length; i++) {
      var todo = arr[i];
      var inputValue = todo.title;
      var todoEl = document.createElement("li");

      if (todo.parentId === null) {
        //Case A: todo

        // set todo element
        todoEl.innerHTML = elementTemplates.getTodoTemplate(inputValue);
        todoEl.classList.add("todolist__todo");
        todoEl.setAttribute("data-id", todo.id);

        // prepend todo
        var formEl = document.querySelector(".todolist__todos");
        formEl.prepend(todoEl);
      } else {
        //Case B: subtodo

        // set todo element
        todoEl.innerHTML = elementTemplates.getTodoTemplate(inputValue);
        todoEl.classList.add("todolist__todo", "is-subtodo");
        todoEl.setAttribute("data-id", todo.id);

        var parentLiEl = document.querySelector(`li[data-id="${todo.parentId}"]`);
        if (i === 0) {
          //if first subtodo, create ul element
          var ulEl = document.createElement("ul");
          parentLiEl.insertAdjacentElement("afterend", ulEl);
        }

        var ulEl = parentLiEl.nextElementSibling;
        ulEl.prepend(todoEl);
      }

      //if task is completed, update DOM
      if (todo.completed) {
        todoEl.classList.add("is-completed");
        var checkboxEl = todoEl.querySelector('input[type="checkbox"]');
        checkboxEl.checked = true;
      }

      //recursion
      if (todo.subtodoArr.length !== 0) {
        this.renderDataFromStorage(todo.subtodoArr);
      }
    }
  },
  toggleTodo: function(todoEl) {
    var todoId = todoEl.getAttribute("data-id");

    // get todo item
    var todoItem = todos.getTodoItem(todos.todosArr, todoId);

    // toggle todo element
    todoEl.classList.toggle("is-completed");

    // toggle todo item
    todoItem.completed = !todoItem.completed;

    // auto toggle all nested todos
    this.autoToggleAllSubTodos(todoItem.subtodoArr, todoItem.completed);

    //save any changes
    todos.saveTodosToStorage();
  },
  autoToggleAllSubTodos: function(arr, value) {
    for (var i = 0; i < arr.length; i++) {
      var todo = arr[i];

      if (todo.completed !== value) {
        //toggle todo item
        todo.completed = value;

        //toggle todo element
        var todoEl = document.querySelector(`li[data-id="${todo.id}"]`);
        todoEl.classList.toggle("is-completed");
        var checkboxEl = todoEl.querySelector('input[type="checkbox"]');
        checkboxEl.checked = value;
      }
      //recursion
      if (todo.subtodoArr.length !== 0) {
        this.autoToggleAllSubTodos(todo.subtodoArr, value);
      }
    }
  },
  clearCompleted: function(arr) {
    for (var i = 0; i < arr.length; i++) {
      var todo = arr[i];

      if (todo.completed === true) {
        var todoEl = document.querySelector(`li[data-id="${todo.id}"]`);
        var el = todoEl.querySelector(".todolist__icon--delete"); //argument of the deleteTodo function must be delete icon element
        this.deleteTodo(el);
        i--;
      } else {
        //recursion
        if (todo.subtodoArr.length !== 0) {
          this.clearCompleted(todo.subtodoArr);
        }
      }
    }
  },
  toggleAll: function() {
    var isFirstTodoCompleted = todos.todosArr[0].completed;

    var allTodosHasSameValue = todos.hasTodosSameValues(todos.todosArr, isFirstTodoCompleted);

    if (allTodosHasSameValue) {
      if (isFirstTodoCompleted) {
        //all are completed -> uncomplete all
        this.toggleAllRecursion(todos.todosArr, false);
      } else {
        //all are uncompleted -> complete all
        this.toggleAllRecursion(todos.todosArr, true);
      }
    } else {
      //complete all
      this.toggleAllRecursion(todos.todosArr, true);
    }

    //save any changes
    todos.saveTodosToStorage();
  },
  toggleAllRecursion: function(arr, value) {
    for (var i = 0; i < arr.length; i++) {
      var todo = arr[i];

      if (todo.completed !== value) {
        //toggle todo item
        todo.completed = value;

        //toggle todo element
        var todoEl = document.querySelector(`li[data-id="${todo.id}"]`);
        todoEl.classList.toggle("is-completed");
        var checkboxEl = todoEl.querySelector('input[type="checkbox"]');
        checkboxEl.checked = value;
      }
      //recursion
      if (todo.subtodoArr.length !== 0) {
        this.toggleAllRecursion(todo.subtodoArr, value);
      }
    }
  }
};

app.init();
