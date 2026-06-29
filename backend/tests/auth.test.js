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

test("registers a new user", async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: "123456",
    });

  expect(res.statusCode).toBe(201);
  expect(res.body.token).toBeDefined();
  expect(res.body.email).toBe("test@example.com");
});


test("logs in an existing user", async () => {
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Login User",
      username: "loginuser",
      email: "login@example.com",
      password: "123456",
    });

  const res = await request(app)
    .post("/api/auth/login")
    .send({
      username: "loginuser",
      password: "123456",
    });

  expect(res.statusCode).toBe(201);
  expect(res.body.token).toBeDefined();
  expect(res.body.username).toBe("loginuser");
});