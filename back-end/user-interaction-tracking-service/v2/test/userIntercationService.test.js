const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const TouchInteraction = require("../models/TouchInteraction");

jest.mock("../models/TouchInteraction");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/testdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Server API Endpoints", () => {
  describe("GET /api/model-status", () => {
    it("should return model status", async () => {
      const response = await request(app).get("/api/model-status");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status");
    });
  });

  describe("POST /api/touch-interactions", () => {
    it("should save touch interaction", async () => {
      const mockInteraction = {
        userID: 1,
        buttonId: "btn1",
        touchPoint: { x: 50, y: 60 },
        buttonBounds: { x: 40, y: 50, width: 100, height: 50 },
        isMissClick: false,
        deviceMetrics: { screenWidth: 1080, screenHeight: 1920, deviceOrientation: "portrait" },
      };
      
      TouchInteraction.prototype.save = jest.fn().mockResolvedValue(mockInteraction);
      
      const response = await request(app).post("/api/touch-interactions").send(mockInteraction);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Interaction saved");
    });
  });

  describe("GET /api/total-interactions", () => {
    it("should return total interactions count", async () => {
      TouchInteraction.countDocuments.mockResolvedValue(10);
      const response = await request(app).get("/api/total-interactions");
      expect(response.status).toBe(200);
      expect(response.body.totalInteractions).toBe(10);
    });
  });

  describe("GET /api/miss-click-rate", () => {
    it("should return miss click rate", async () => {
      TouchInteraction.countDocuments.mockResolvedValueOnce(100).mockResolvedValueOnce(30);
      const response = await request(app).get("/api/miss-click-rate");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("missClickRate");
    });
  });

  describe("POST /api/train", () => {
    it("should return error when not enough data", async () => {
      TouchInteraction.find.mockResolvedValue([]);
      const response = await request(app).post("/api/train").send({ buttonId: "btn1" });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Not enough successful clicks for training");
    });
  });

  describe("POST /api/predict", () => {
    it("should return predicted UI adjustments", async () => {
      const mockMetrics = {
        x: 100,
        y: 200,
        width: 150,
        height: 50,
        screenWidth: 1080,
        screenHeight: 1920,
      };

      const response = await request(app).post("/api/predict").send({ metrics: mockMetrics });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("width");
      expect(response.body).toHaveProperty("height");
    });
  });
});
