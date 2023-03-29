import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";

import authConfig from "../../../../config/auth";

import createConnection from "../../../../database";

let connection: Connection;

describe("Authenticate user controller", () => {
  beforeAll(async () => {
    authConfig.jwt.secret = "21232f297a57a5a743894a0e4a801fc3";
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to authenticate a user controller", async () => {
    const user = { 
      name: "renan",
      email: "renan@email.com",
      password: "123"
    }
    
    await request(app).post("/api/v1/users").send(user);

    const resAuthenticate = await request(app).post("/api/v1/sessions").send({
      email: "renan@email.com",
      password: "123"
    });
    
    expect(resAuthenticate.status).toBe(200);
    expect(resAuthenticate.body).toHaveProperty("token");
    expect(resAuthenticate.body.user).toHaveProperty("id");
    expect(resAuthenticate.body.user).toHaveProperty("name", user.name);
    expect(resAuthenticate.body.user).toHaveProperty("email", user.email);
  });

  it("Should not be able to authenticate an unexistent user controller", async () => {
    const resAuthenticate = await request(app).post("/api/v1/sessions").send({
      email: "fake@email.com",
      password: "123"
    });

    expect(resAuthenticate.status).toBe(401);
  });

  it("Should not be able to authenticate an user with incorrect password controller", async () => {
    const user = { 
      name: "Maria",
      email: "maria@email.com",
      password: "123"
    }
    
    await request(app).post("/api/v1/users").send(user);

    const resAuthenticate = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: "fake password"
    });

    expect(resAuthenticate.status).toBe(401);
  });
});