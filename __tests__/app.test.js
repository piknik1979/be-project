const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  if (db.end) db.end();
});

describe("1. GET /api/topics", () => {
  test('status:200, responds with an array of topic objects, each of them with properties of "slug" and "description"', () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("status 404 - path not found", () => {
    return request(app)
      .patch("/api/invalid")
      .expect(404)
      .then((res) => {
        expect(res.body).toMatchObject({ msg: "Path not found!" });
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("status:200, responds with single matching article object", () => {
    return request(app)
      .get("/api/articles/6")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_id: 6,
          author: "icellusedkars",
          body: "Delicious tin of cat food",
          created_at: "2020-10-18T01:00:00.000Z",
          title: "A",
          topic: "mitch",
          votes: 0,
          comment_count: "1",
        });
      });
  });

  test("400, error responds when the votes is not an integer", () => {
    return request(app)
      .get("/api/articles/wrongggg")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`Invalid request`);
      });
  });

  describe("PATCH /api/articles/:article_id", () => {
    test("200: responds with updated article object", () => {
      const updates = { inc_votes: 10 };
      return request(app)
        .patch("/api/articles/6")
        .send(updates)
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toEqual({
            article_id: 6,
            title: "A",
            topic: "mitch",
            author: "icellusedkars",
            body: "Delicious tin of cat food",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: 10,
          });
        });
    });

    test("200: responds with updated article object if number of votes is negative", () => {
      const updates = { inc_votes: -10 };
      return request(app)
        .patch("/api/articles/6")
        .send(updates)
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toEqual({
            article_id: 6,
            title: "A",
            topic: "mitch",
            author: "icellusedkars",
            body: "Delicious tin of cat food",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: -10,
          });
        });
    });

    test("status: 400 response with a bad request message when invalid property data inputted", () => {
      const input = {
        surname: "Lewangoalski",
      };
      return request(app)
        .patch("/api/articles/6")
        .send(input)
        .expect(400)
        .then((res) => {
          expect(res.body).toMatchObject({ msg: "Invalid request" });
        });
    });
    test("status: 404 response with the message  when the article is not found", () => {
      const input = {
        inc_votes: 1,
      };
      return request(app)
        .patch("/api/articles/100")
        .send(input)
        .expect(404)
        .then((res) => {
          expect(res.body).toMatchObject({ msg: "Article Not Found" });
        });
    });
    test("status: 400 response with the message Invalid request if the wrong data type inputted ", () => {
      const input = {
        inc_votes: "message",
      };
      return request(app)
        .patch("/api/articles/100")
        .send(input)
        .expect(400)
        .then((res) => {
          expect(res.body).toMatchObject({ msg: "Invalid request" });
        });
    });
    test("status: 400 response with the message Invalid request if the invalid article Id ", () => {
      const input = {
        inc_votes: 6,
      };
      return request(app)
        .patch("/api/articles/hello")
        .send(input)
        .expect(400)
        .then((res) => {
          expect(res.body).toMatchObject({ msg: "Invalid request" });
        });
    });
  });
});

describe("GET /api/users", () => {
  test("status:200, responds with an array of user objects, they will have username property", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
  test("404 - Not found", () => {
    return request(app)
      .get("/api/unexisting_path")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found!");
      });
  });
});
describe("GET /api/articles/:article_id (comment count)", () => {
  test("Responds with the article object, now including the total count of comments with this article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        const article = res.body.article;
        const output = {
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          comment_count: "11",
        };
        expect(article).toEqual(output);
        expect(article.comment_count).toMatch(/^[0-9]+$/);
      });
  });
  test("Responds with the article object, and comment count of 0 when there are none matching the article_id", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then((res) => {
        const article = res.body.article;
        const output = {
          author: "rogersop",
          title: "Student SUES Mitch!",
          article_id: 4,
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          topic: "mitch",
          created_at: "2020-05-06T01:14:00.000Z",
          votes: 0,
          comment_count: "0",
        };
        expect(article).toEqual(output);
        expect(article.comment_count).toMatch(/^[0-9]+$/);
      });
  });
  test("returns '404 - path not found' if id doesn't exist", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article 1000 does not exist");
      });
  });
  test("returns '400 - bad request' if id type is wrong", () => {
    return request(app)
      .get("/api/articles/one")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
});
