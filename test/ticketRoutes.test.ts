import request from "supertest";
import app from "../src/app";

describe("Ticket Routes", () => {
  describe("GET /api/v1/tickets", () => {
    it("should return 200 and an array of tickets", async () => {
      // Arrange
      const url = "/api/v1/tickets";

      // Act
      const res = await request(app).get(url);

      // Assert
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("POST /api/v1/tickets", () => {
    it("should create a ticket and return 201", async () => {
      // Arrange
      const url = "/api/v1/tickets";
      const payload = {
        title: "Test ticket",
        description: "Test description",
        priority: "low",
      };

      // Act
      const res = await request(app).post(url).send(payload);

      // Assert
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.title).toBe(payload.title);
      expect(res.body.data.priority).toBe(payload.priority);
      expect(res.body.data.status).toBe("open"); // auto default
    });

    it("should return 400 when title is missing", async () => {
      // Arrange
      const url = "/api/v1/tickets";
      const payload = {
        description: "Test description",
        priority: "low",
      };

      // Act
      const res = await request(app).post(url).send(payload);

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Missing required field: title");
    });
  });

  describe("GET /api/v1/tickets/:id", () => {
    it("should return 404 when ticket does not exist", async () => {
      // Arrange
      const url = "/api/v1/tickets/does-not-exist";

      // Act
      const res = await request(app).get(url);

      // Assert
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Ticket not found");
    });
  });

  describe("PUT /api/v1/tickets/:id", () => {
    it("should return 400 for invalid status", async () => {
      // Arrange (create a ticket first)
      const createRes = await request(app).post("/api/v1/tickets").send({
        title: "Update test",
        description: "Update test desc",
        priority: "medium",
      });
      const id = createRes.body.data.id;

      const url = `/api/v1/tickets/${id}`;
      const payload = { status: "done" }; // invalid

      // Act
      const res = await request(app).put(url).send(payload);

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        "Invalid status. Must be one of: open, in-progress, resolved"
      );
    });
  });

  describe("DELETE /api/v1/tickets/:id", () => {
    it("should return 404 when ticket does not exist", async () => {
      // Arrange
      const url = "/api/v1/tickets/does-not-exist";

      // Act
      const res = await request(app).delete(url);

      // Assert
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Ticket not found");
    });
  });

  describe("GET /api/v1/tickets/:id/urgency", () => {
    it("should return 200 and include urgency for an existing ticket", async () => {
      // Arrange (create a ticket first)
      const createRes = await request(app).post("/api/v1/tickets").send({
        title: "Urgency test",
        description: "Urgency test desc",
        priority: "high",
      });
      const id = createRes.body.data.id;

      const url = `/api/v1/tickets/${id}/urgency`;

      // Act
      const res = await request(app).get(url);

      // Assert
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("urgency");
    });
  });
});
