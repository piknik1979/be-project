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
        expect(res.body).toMatchObject({ message: "Path not found!" });
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
          expect(res.body).toMatchObject({ message: "Invalid request" });
        });
    });
  });
});
