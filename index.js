import express from "express";
import fetch from "node-fetch";

const app = express();

function countProjectByYear(project, yearSelect) {
  return project.filter((projeto) => {
    const yearCreated = new Date(project.created_at).getFullYear();
    return yearCreated === yearSelect;
  }).length;
}

app.get("/graphics", async (req, res) => {
  const result = await fetch(
    `https://api.github.com/users/${req.query.user}/repos`,
  );
  const data = await result.json();

  const years = data
    .map((item) => {
      return new Date(item.created_at).getFullYear();
    })
    .filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

  const graphics = years.map((year) => {
    return {
      year,
      count: countProjectByYear(data, year),
    };
  });
  res.send(graphics);
});

app.listen(3000, () => {
  console.log("server started");
});
