const express = require("express");
const { getTopics, getArticleById, getUser } = require("./controllers/news.controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users", getUser);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Path not found!" });
});

app.use((err, req, res, next) => {
  const wrongReqCodes = ["22P02"];
  if (wrongReqCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.message && err.status) {
    res.status(err.status).send({ message: err.message })
  } else {
    next(err)
  }
})

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
