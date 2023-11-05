const express = require("express");
path = require("path");

const app = express();
port = process.env.PORT || 3000;

const dotenv = require("dotenv"),
  { Client } = require("pg");

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});

client.connect();

app.use(express.json());

app.get("/api", async (_request, response) => {
  const { rows } = await client.query("SELECT * FROM to_do");
  response.send(rows);
});

app.post("/api", async (request, response) => {
  const { task } = request.body;
  if (task) {
    const query = "INSERT INTO to_do (task) VALUES ($1) RETURNING *";
    const values = [task];

    try {
      const { rows } = await client.query(query, values);
      response.status(201).json(rows[0]);
    } catch (error) {
      console.error("Error inserting data:", error);
      response
        .status(500)
        .json({ error: "Something went wrong inserting data" });
    }
  } else {
    response.status(400).json({ error: "Invalid data" });
  }
});

app.delete("/api/:taskId", async (request, response) => {
  const taskId = request.params.taskId;

  if (!taskId) {
    response.status(400).json({ error: "Invalid ID on task" });
    return;
  }

  const query = "DELETE FROM to_do WHERE id =$1";
  const values = [taskId];

  try {
    const result = await client.query(query, values);
    if (result.rowCount > 0) {
      response.status(200).json({ message: "Task is deleted" });
    } else {
      response.status(404).json({ error: "Task was not found" });
    }
  } catch (error) {
    connsole.error("Error accured removing task:", error);
    response
      .status(500)
      .json({ error: "Something went wrong by removing task" });
  }
});

app.use(express.static(path.join(path.resolve(), "public")));

app.listen(port, () => {
  console.log(`Server körs på http://localhost:${port}`);
});
