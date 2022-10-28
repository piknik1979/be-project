const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles \
    LEFT JOIN comments \
    ON comments.article_id = articles.article_id \
    WHERE articles.article_id = $1 \
    GROUP BY articles.article_id;",
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article ${article_id} does not exist`,
        });
      }
      return result.rows[0];
    });
};

// join commentsByArticle with selectArticleById
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

exports.selectArticles = async () => {
  // query joins articles and comments tables on article_id, counts the number of comments matching an article_id and groups the data by this.
  const queryStr = `SELECT articles.*,
    CAST(COUNT(comments.comment_id) AS int) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`;

  const articlesData = await db.query(queryStr);

  return articlesData.rows;
};
