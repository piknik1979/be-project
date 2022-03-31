const comments = require("../db/data/test-data/comments");
const {
  selectTopics,
  selectArticleById,
  commentsByArticle,
  updateArticle,

  selectUser,
} = require("../models/new.models");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics: topics });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [
    selectArticleById(article_id),
    commentsByArticle(article_id),
  ];
  Promise.all(promises)
    .then((results) => {
      const article = results[0];
      const { count } = results[1];
      article.comment_count = Number(count);
      res.status(200).send({ article, count });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getUser = (req, res) => {
  selectUser().then((users) => {
    res.status(200).send({ users });
  });
};
