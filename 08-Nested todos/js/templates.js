var elementTemplates = {
    getTodoTemplate: function(inputValue) {
      return `
            <input type="checkbox" name="" id="" class="todolist__checkbox" />
            <input type="text" class="todolist__todo-input is-hidden">
            <label for="" class="todolist__todo-label">${inputValue}</label>
  
            <svg class="todolist__icon todolist__icon--plus" width="24" height="24" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
            <svg class="todolist__icon todolist__icon--delete" width="24" height="24" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>`;
    },
   
  };