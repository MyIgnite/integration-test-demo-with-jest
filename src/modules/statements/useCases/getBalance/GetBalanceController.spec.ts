
import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";

import authConfig from "../../../../config/auth";

import createConnection from "../../../../database";

let connection: Connection;

describe("Get balance controller", () => {
  beforeAll(async () => {
    authConfig.jwt.secret = "21232f297a57a5a743894a0e4a801fc3";
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should not be able get the balance from a nonexistent user account", async () => {
    const token = "id inexistent";

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(401);
  });

  it("Should be able get the balance from an user account", async () => {
    const user = {
      name: "renan",
      email: "renan@email.com",
      password: "123",
    }
    
    await request(app).post("/api/v1/users").send(user);

    const auth = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password,
    });

    const { token } = auth.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "It is deposit",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const res = await request(app)
      .get("/api/v1/statements/balance")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });
      
    expect(res.body).toHaveProperty("balance", 100);
    expect(res.body.statement[0]).toHaveProperty("id");
    expect(res.body.statement[0]).toHaveProperty("created_at");
    expect(res.body.statement[0]).toHaveProperty("updated_at");
    expect(res.body.statement[0]).toHaveProperty("description", "It is deposit");
    expect(res.body.statement[0]).toHaveProperty("type", "deposit");
  });
});