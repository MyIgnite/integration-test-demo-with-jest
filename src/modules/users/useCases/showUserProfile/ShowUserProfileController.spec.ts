import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";

import authConfig from "../../../../config/auth";

import createConnection from "../../../../database";

let connection: Connection; 

describe("Show user profile controller", () => {
  beforeAll(async () => {
    authConfig.jwt.secret = "21232f297a57a5a743894a0e4a801fc3";
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to return an user profile controller", async () => {
    const user = { 
      name: "renan",
      email: "renan@email.com",
      password: "123"
    }
    
    await request(app).post("/api/v1/users").send(user);

    const auth = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password
    });

    const token = auth.body.token;

    const resProfile = await request(app)
      .get("/api/v1/profile")
      .send()
      .set({
        Authorization: `Bearer ${token}`
      })
    
      expect(resProfile.status).toBe(200);
      expect(resProfile.body).toHaveProperty('id');
      expect(resProfile.body).toHaveProperty('created_at');
      expect(resProfile.body).toHaveProperty('updated_at');
      expect(resProfile.body).toHaveProperty('name', user.name);
      expect(resProfile.body).toHaveProperty('email', user.email);
  });
});