const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
  const text = `SELECT * FROM articles WHERE article_id = $1;`;
  const values = [article_id];
  return db.query(text, values).then((result) => {
    return result.rows[0];
  });
};

exports.commentsByArticle = (article_id) => {
  const text = `SELECT COUNT(*) FROM comments WHERE article_id = $1;`;
  const values = [article_id];
  return db.query(text, values).then((result) => {
    return result.rows[0];
  });
};

exports.updateArticle = (article_id, inc_votes) => {
  const q = `UPDATE articles 
                SET votes = votes + $2 
                WHERE article_id = $1
                RETURNING *;`;
  if (inc_votes === undefined) {
    return Promise.reject({ msg: "Invalid request", status: 400 });
  }
  return db.query(q, [article_id, inc_votes]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `Article Not Found`,
      });
    }
    return result.rows[0];
  });
};
exports.selectUser = () => {
  return db.query("SELECT * FROM users").then((result) => {
    return result.rows;
  });
};

exports.selectArticles = () => {
  let queryStr = `SELECT articles.*, 
    COUNT(comments.comment_id) AS comment_count FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`;

  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};
