import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";

import authConfig from "../../../../config/auth";

import createConnection from "../../../../database";

let connection: Connection;

describe("Create Statement controller", () => {
  beforeAll(async () => {
    authConfig.jwt.secret = "21232f297a57a5a743894a0e4a801fc3";
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to make a deposit in account controller", async () => {
    const user = { 
      name: "lucas",
      email: "lucas@email.com",
      password: "123"
    }
    
    await request(app).post("/api/v1/users").send(user);

    const auth = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password
    });

    const { token } = auth.body;

    const statement = {
      amount: 100,
      description: "It is deposit"
    };

    const res = await request(app)
      .post("/api/v1/statements/deposit")
      .send(statement)
      .set({
        Authorization: `Bearer ${token}`
      });

      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("user_id");
      expect(res.body).toHaveProperty("created_at");
      expect(res.body).toHaveProperty("updated_at");
      expect(res.body).toHaveProperty("description", "It is deposit");
      expect(res.body).toHaveProperty("amount", 100);
      expect(res.body).toHaveProperty("type", "deposit");
  });
});