import request from "supertest";
import mongoose from "mongoose"

import {MongoMemoryServer} from "mongodb-memory-server";

import app from "../src/app.js";

let mongoServer;

beforeAll(async () => {
  process.env.JWT_SECRET = "test_secret";
  process.env.JWT_EXPIRES_IN = "1d";

  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test("test url short with token", async () => {
    const res = await request(app)
        .post("/api/auth/register")
        .send({
            name: "Test User",
            username: "testuser",
            email: "test@example.com",
            password: "123456",
        });

    const token = res.body.token;
    const RandomShort = await request(app)
        .post("/api/urls/shorten")  // HTTP method first
        .set('Authorization', `Bearer ${token}`)  // Then set headers
        .send({
            originalUrl: "https://github.com/cosmic1",
            withUsername: false
        });

    expect(RandomShort.statusCode).toBe(201);
    expect(RandomShort.body.data.shortUrl).toBeDefined();
});




test("test url short without token", async () => {

    const RandomShort = await request(app)
        .post("/api/urls/shorten")
        .send({
            originalUrl: "https://github.com/cosmic1",
            withUsername: false
        });

    expect(RandomShort.statusCode).toBe(400);
});


test("gets my URLs with token", async () => {
  const registerRes = await request(app)
    .post("/api/auth/register")
    .send({
      name: "My Url User",
      username: "myurluser",
      email: "myurl@example.com",
      password: "123456",
    });

  const token = registerRes.body.token;

  await request(app)
    .post("/api/urls/shorten")
    .set("Authorization", `Bearer ${token}`)
    .send({
      originalUrl: "https://github.com/cosmic1",
      withUsername: false,
    });

  await request(app)
    .post("/api/urls/shorten")
    .set("Authorization", `Bearer ${token}`)
    .send({
      originalUrl: "https://google.com",
      customAlias: "google-test",
      withUsername: false,
    });

  const res = await request(app)
    .get("/api/urls/my")
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.count).toBe(2);
  expect(res.body.data.length).toBe(2);
  expect(res.body.data[0].createdBy).toBeDefined();
});