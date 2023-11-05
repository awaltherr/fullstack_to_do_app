import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [newTask, setNewTask] = useState("");

  const fetchfromDb = () => {
    fetch("/api")
      .then((response) => response.json())
      .then((result) => {
        setData(result);
      });
  };

  useEffect(() => {
    fetchfromDb();
  }, [data]);

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
        setNewTask("");
        setData((prevData) => [...prevData]);
        fetchfromDb();
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
              <button onClick={() => handleDeleteTask(item.id)}>X</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
