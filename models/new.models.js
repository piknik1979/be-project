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

exports.updateArticle = (article_id, inc_votes) => {
  const q = `UPDATE articles 
                SET votes = votes + $2 
                WHERE article_id = $1
                RETURNING *;`;
  if (inc_votes === undefined) {
    return Promise.reject({ message: "Bad request", status: 400 });
  }
  return db.query(q, [article_id, inc_votes]).then((result) => {
    return result.rows[0];
  });
};
