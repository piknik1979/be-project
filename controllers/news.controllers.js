const {
  selectTopics,
  selectArticleById,
  selectUser,
} = require("../models/new.models");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics: topics });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.getUser = (req, res) => {
  selectUser().then((users) => {
    res.status(200).send({ users });
  });
};
