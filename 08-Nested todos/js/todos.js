var todos = {
  todosArr: [],
  getUniqueId: function() {
    // returns random 16 numbers
    var id = "";
    for (var i = 0; i < 16; i++) {
      id += Math.floor(Math.random() * 9);
    }
    return id;
  },
  createTodoItem: function(title, todoId) {
    var todoItem = {
      title: title,
      id: todoId,
      parentId: null,
      completed: false,
      subtodoArr: []
    };

    this.todosArr.push(todoItem);
  },
  createSubTodoItem: function(todoId, parentId, todoItem) {
    var subTodoItem = {
      title: null,
      id: todoId,
      parentId: parentId,
      completed: false,
      subtodoArr: []
    };

    todoItem.subtodoArr.push(subTodoItem);
  },
  getTodoItem: function(arr, id) {
    for (var i = 0; i < arr.length; i++) {
      var todo = arr[i];

      //Base case: found mathing todo
      if (todo.id === id) {
        return todo;
      }
      //recursion
      if (todo.subtodoArr.length !== 0) {
        var returnedValue = this.getTodoItem(todo.subtodoArr, id);
        if (returnedValue !== undefined) {
          return returnedValue;
        }
      }
    }
  },
  deleteTodo: function(parentTodo, childTodo) {
    var arrayToSearch;
    if (parentTodo === undefined) {
      //root of the array
      arrayToSearch = this.todosArr;
    } else {
      arrayToSearch = parentTodo.subtodoArr;
    }
    indexOfChildTodo = arrayToSearch.findIndex(function(todo) {
      return todo.id === childTodo.id;
    });

    arrayToSearch.splice(indexOfChildTodo, 1);
  },
  hasTodosSameValues: function(arr, compareValue) {
    return arr.every(function(todo) {
      if (todo.completed === compareValue) {
        if (todo.subtodoArr.length !== 0) {
          //recursion
          return this.hasTodosSameValues(todo.subtodoArr, compareValue);
        } else {
          return true;
        }
      } else {
        return false;
      }
    }, this);
  },
  getTodosFromStorage: function() {
    var data = localStorage.getItem("todolist");
    var parsedData = JSON.parse(data); 
    return parsedData;
  },
  saveTodosToStorage: function() {
    localStorage.setItem("todolist", JSON.stringify(this.todosArr));
  }
};
