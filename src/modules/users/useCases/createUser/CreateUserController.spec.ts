import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";

import createConnection from "../../../../database";

let connection: Connection;

describe("Create user controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new user", async () => {
    const res = await request(app).post("/api/v1/users").send({ 
      name: "renan",
      email: "renan@email.com",
      password: "123"
    });

    expect(res.status).toBe(201);
  });

  it("Should not be able to create a new user with email exists", async () => {
    await request(app).post("/api/v1/users").send({ 
      name: "renan",
      email: "renan@email.com",
      password: "123"
    });

    const res = await request(app).post("/api/v1/users").send({ 
      name: "renan",
      email: "renan@email.com",
      password: "123"
    });

    expect(res.status).toBe(400);
  });
});