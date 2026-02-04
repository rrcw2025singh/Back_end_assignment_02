import request from "supertest";
import app from "../src/app";

describe("Health endpoint", () => {
  it("should return 200 and health data", async () => {
    // Arrange
    const url = "/api/v1/health";

    // Act
    const res = await request(app).get(url);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("OK");
    expect(res.body).toHaveProperty("uptime");
    expect(res.body).toHaveProperty("timestamp");
    expect(res.body).toHaveProperty("version");
  });
});
