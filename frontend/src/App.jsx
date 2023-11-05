import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [newTask, setNewTask] = useState("");

  const handleNewTask = () => {
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: newTask }),
    })
      .then((response) => response.json())
      .then(() => {
        fetch("/api")
          .then((response) => response.json())
          .then((newTask) => {
            setData([...data, newTask]);
            setNewTask("");
          });
      });
  };

  const handleDeleteTask = (taskId) => {
    fetch(`/api/${taskId}`, {
      method: "DELETE",
    }).then(() => {
      const updatedList = data.filter((item) => item.id !== taskId);
      setData(updatedList);
    });
  };

  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((result) => {
        setData(result);
      });
  }, []);

  return (
    <>
      <div>
        <h3>Todo App</h3>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={handleNewTask} disabled={newTask.trim() === ""}>
          Add
        </button>
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              {item.task}{" "}
              {!item.completed && (
                <>
                  <button onClick={() => handleDeleteTask(item.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
