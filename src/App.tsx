import "./App.css";
import TodoForm from "./components/form";
import TodoList from "./components/todo-list";
import SortSelect from "./components/sort-select";
import { useEffect, useState } from "react";
import { collection, query, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "./firebase/db.ts";
import type { TodoType } from "./types/todo";

function App() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [sortBy, setSortBy] = useState("");
  const [newTodoTrigger, setNewTodoTrigger] = useState(false);

  function sortChecked() {
    todos.sort((a) => {
      return !a.isCheck ? -1 : 1;
    });

    setTodos([...todos]);
  }

  function sortCreation() {
    todos.sort((a, b) => {
      const aCreate: Timestamp = a.dateCreated;
      const bCreate: Timestamp = b.dateCreated;

      return aCreate.seconds - bCreate.seconds;
    });
    setTodos([...todos]);
  }

  function sortDeadline() {
    todos.sort((a, b) => {
      const aDate = new Date(a.date + " " + a.time).getTime();
      const bDate = new Date(b.date + " " + b.time).getTime();

      return aDate - bDate;
    });
    setTodos([...todos]);
  }

  function sortPriority() {
    todos.sort((a, b) => {
      const aPrio: number = +a.priority;
      const bPrio: number = +b.priority;
      return bPrio - aPrio;
    });
    setTodos([...todos]);
  }

  function handleSort() {
    if (sortBy == "priority") {
      sortPriority();
    } else if (sortBy == "deadline") {
      sortDeadline();
    } else {
      sortCreation();
    }
    todos.reverse();
    sortChecked();
  }

  useEffect(() => {
    handleSort();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, newTodoTrigger]);

  useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todos: TodoType[] = [];
      querySnapshot.forEach((doc) => {
        const todoData = { ...doc.data(), id: doc.id };
        todos.push(todoData as TodoType);
      });
      setTodos(todos);
      setNewTodoTrigger((n) => !n);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex-col items-center align-middle w-1/2">
        <TodoForm
          dateCreated={null}
          time={null}
          date={null}
          description={null}
          id={null}
          priority={null}
          isEdit={null}
          key={null}
        />
        <SortSelect setSortBy={setSortBy} />
        <TodoList todos={todos} />
      </div>
    </div>
  );
}

export default App;
