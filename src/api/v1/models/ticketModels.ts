export type TicketPriority = "critical" | "high" | "medium" | "low";
export type TicketStatus = "open" | "in-progress" | "resolved";

/**
 * Represents a support ticket in the system
 */
export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Ticket data for creating a new ticket
 */
export interface CreateTicketData {
  title: string;
  description: string;
  priority: TicketPriority;
}

/**
 * Allowed update fields for a ticket
 */
export type UpdateTicketData = Partial<Pick<Ticket, "title" | "description" | "priority" | "status">>;
