const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;

  const user = users.find(user => user.username ===username);
  if(!user){
    return response.status(404).json({error: 'User not found'});
  }

    request.user = user;

    return next();
}

app.post('/users', (request, response) => {
  const {name, username} = request.body;

  const userExists = users.find(user => user.username === username);

  if(userExists) {
    return response.status(400).json({error: 'User already exists'})
  }

  const user = {
    id: uuidv4(),
    name, 
    username,
    todos: []
  }

  user.push(user);

  return response.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;

  return response.json(user);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {title, deadline} = request.body;

  const todo = { 
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).json(user);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {title, deadline} = request.body;
  const {id} = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo) {
    return response.status(404).json({error: 'Todo not found'});
  }

  todo.title = title;
  todo.deadline = new Date(deadline);
  
  return response.status(404).json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params;

  const todo = user.todos.find(todo => todo.id === id);
  
  if(!todo) {
    return response.status(404).json({error: 'Todo not found'});
  }

  todo.done = true;

  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params;

  const todoIndex = user.todos.findIndex(todo => todo.id === id);

  if(todoIndex === -1) {
    return response.status(404).json({error: 'Todo not found'});
  }

  user.todos.slice(todoIndex, 1);

  //FindIndex retorna a posição que esse array existe
  //splice recebe coisas no array, primeiro é o que quer, segundo é a posição indicada
  // a partir da posição 0, excluir 1 elemento

  return response.status(204).json();
}); 

module.exports = app;

app.listen(3333);