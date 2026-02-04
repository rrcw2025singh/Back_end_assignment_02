import * as ticketService from "../src/api/v1/services/ticketservice";
import type { Ticket } from "../src/api/v1/models/ticketModels";

describe("ticketService.calculateUrgency", () => {
  it("should increase urgency score as ticket age increases", async () => {
    // Arrange
    const now = new Date();
    const oldDate = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago

    const newerTicket: Ticket = {
      id: "1",
      title: "New ticket",
      description: "Recently created",
      priority: "medium",
      status: "open",
      createdAt: now,
      updatedAt: now,
    };

    const olderTicket: Ticket = {
      id: "2",
      title: "Old ticket",
      description: "Created earlier",
      priority: "medium",
      status: "open",
      createdAt: oldDate,
      updatedAt: oldDate,
    };

    // Act
    const newerUrgency = await ticketService.calculateUrgency(newerTicket);
    const olderUrgency = await ticketService.calculateUrgency(olderTicket);

    // Assert
    expect(olderUrgency.score).toBeGreaterThan(newerUrgency.score);
  });

  it("should give higher urgency to critical priority than low priority", async () => {
    // Arrange
    const createdAt = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago

    const lowTicket: Ticket = {
      id: "3",
      title: "Low priority",
      description: "Low issue",
      priority: "low",
      status: "open",
      createdAt,
      updatedAt: createdAt,
    };

    const criticalTicket: Ticket = {
      id: "4",
      title: "Critical priority",
      description: "Critical issue",
      priority: "critical",
      status: "open",
      createdAt,
      updatedAt: createdAt,
    };

    // Act
    const lowUrgency = await ticketService.calculateUrgency(lowTicket);
    const criticalUrgency = await ticketService.calculateUrgency(criticalTicket);

    // Assert
    expect(criticalUrgency.score).toBeGreaterThan(lowUrgency.score);
  });

  it("should handle resolved tickets correctly", async () => {
    // Arrange
    const createdAt = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

    const resolvedTicket: Ticket = {
      id: "5",
      title: "Resolved ticket",
      description: "Already resolved",
      priority: "high",
      status: "resolved",
      createdAt,
      updatedAt: createdAt,
    };

    // Act
    const urgency = await ticketService.calculateUrgency(resolvedTicket);

    // Assert
    expect(urgency).toHaveProperty("level");
    expect(urgency).toHaveProperty("message");
  });
});
