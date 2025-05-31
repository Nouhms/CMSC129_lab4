import type { TodoType } from "../types/todo.ts";
import TodoItem from "./todo-item";

interface TodoListProps {
  todos: TodoType[];
}

function TodoList(props: Readonly<TodoListProps>) {
  const { todos } = props;

  return (
    <div className=" flex-col items-center justify-center align-middle">
      {todos.map((todo) => {
        return (
          <TodoItem
            isCheck={todo.isCheck}
            time={todo.time}
            date={todo.date}
            description={todo.description}
            id={todo.id ?? ""}
            priority={todo.priority}
            isEdit={todo.isEdit}
            key={todo.id ?? ""}
            dateCreated={todo.dateCreated}
          />
        );
      })}
    </div>
  );
}

export default TodoList;
