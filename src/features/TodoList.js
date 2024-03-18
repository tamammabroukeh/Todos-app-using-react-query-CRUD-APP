import React from "react";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../api/todosApi";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
const TodoList = () => {
  const [newTodo, setNewTodo] = useState("");
  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    error,
    data: todos,
  } = useQuery("todos", getTodos, {
    select: (data) => data.sort((a, b) => b.id - a.id),
  });
  //   console.log(todos);
  const addTodoMutation = useMutation(addTodo, {
    onSuccess: () => {
      // Invalidates cache and refetch
      queryClient.invalidateQueries("todos");
    },
  });
  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: () => {
      // Invalidates cache and refetch
      queryClient.invalidateQueries("todos");
    },
  });
  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      // Invalidates cache and refetch
      queryClient.invalidateQueries("todos");
    },
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    addTodoMutation.mutate({ userId: 1, title: newTodo, completed: false });
    setNewTodo("");
  };
  const newTodoSection = (
    <form onSubmit={handleSubmit}>
      <label htmlFor="new_todo">Enter a new todo item</label>
      <div className="new-todo">
        <input
          id="new_todo"
          value={newTodo}
          type="text"
          placeholder="Enter a new todo"
          onChange={(e) => setNewTodo(e.target.value)}
        />
      </div>
      <button className="submit">
        <FontAwesomeIcon icon={faUpload} />
      </button>
    </form>
  );
  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p>{error.message}</p>;
  } else {
    content = todos.map((todo) => {
      return (
        <article key={todo.id}>
          <div className="todo">
            <input
              type="checkbox"
              id={todo.id}
              checked={todo.completed}
              onChange={() =>
                updateTodoMutation.mutate({
                  ...todo,
                  completed: !todo.completed,
                })
              }
            />
            <label className={todo.id}>{todo.title}</label>
          </div>
          <button
            className="trash"
            onClick={() => deleteTodoMutation.mutate({ id: todo.id })}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </article>
      );
    });
  }
  return (
    <main>
      <h1>Todo List</h1>
      {newTodoSection}
      {content}
    </main>
  );
};

export default TodoList;
