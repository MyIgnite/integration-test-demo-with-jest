
import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";

import authConfig from "../../../../config/auth";

import createConnection from "../../../../database";

let connection: Connection;

describe("Get statement operation controller", () => {
  beforeAll(async () => {
    authConfig.jwt.secret = "21232f297a57a5a743894a0e4a801fc3";
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should not be able to return an user statement operation nonexistent", async () => {
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

    const statement_id = "21232f297a57a5a743894a0e4a801fc3";

    const response = await request(app)
      .get(`/api/v1/statements/${statement_id}`)
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(404);
  });

  it("Should be able get an statement from an user account", async () => {
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

    const statement = {
      amount: 30,
      description: "It is deposit",
    };

    const resDeposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send(statement)
      .set({
        Authorization: `Bearer ${token}`,
      });

    const id = resDeposit.body.id;

    const resStatements = await request(app)
      .get(`/api/v1/statements/${id}`)
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(resStatements.body).toHaveProperty("id");
    expect(resStatements.body).toHaveProperty("user_id");
    expect(resStatements.body).toHaveProperty("created_at");
    expect(resStatements.body).toHaveProperty("updated_at");
    expect(resStatements.body).toHaveProperty("description", statement.description);
    expect(resStatements.body).toHaveProperty("amount", statement.amount.toFixed(2));
    expect(resStatements.body).toHaveProperty("type", "deposit");
  });
});