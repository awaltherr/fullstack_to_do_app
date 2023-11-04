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

app.get("/api", async (_request, response) => {
  const { rows } = await client.query("SELECT * FROM to_do");
  response.send(rows);
});

app.use(express.static(path.join(path.resolve(), "public")));

app.listen(port, () => {
  console.log(`Server körs på http://localhost:${port}`);
});
