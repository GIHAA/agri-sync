import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import router from "../api/seedTransaction.routes";

const app = express();
app.use(express.json());
app.use("/api/transactions", router);

const mockUser = { id: "12345" };
const mockToken = jwt.sign(mockUser, process.env.JWT_SECRET || "your_jwt_secret");

jest.mock("../services/seedTransaction.service", () => ({
  createSeedTransaction: jest.fn().mockResolvedValue({ id: 1, name: "Test Transaction" }),
  getTransactionById: jest.fn().mockResolvedValue({ id: 1, name: "Test Transaction" }),
  getTransactions: jest.fn().mockResolvedValue([{ id: 1, name: "Test Transaction" }]),
}));

describe("Seed Transaction Routes", () => {
  it("should create a new transaction", async () => {
    const res = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${mockToken}`)
      .send({ name: "Test Transaction" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      success: true,
      data: { id: 1, name: "Test Transaction" },
    });
  });

  it("should get a transaction by ID", async () => {
    const res = await request(app)
      .get("/api/transactions/1")
      .set("Authorization", `Bearer ${mockToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: { id: 1, name: "Test Transaction" },
    });
  });

  it("should get all transactions", async () => {
    const res = await request(app)
      .get("/api/transactions")
      .set("Authorization", `Bearer ${mockToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: [{ id: 1, name: "Test Transaction" }],
    });
  });
});
