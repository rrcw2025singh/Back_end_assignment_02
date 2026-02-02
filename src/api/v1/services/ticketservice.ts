import type { Ticket, CreateTicketData, UpdateTicketData } from "../models/ticketModels";


// In-memory storage for demo purposes
const tickets: Ticket[] = [];

// Seed tickets (optional but helpful)
const seed = (): void => {
  if (tickets.length > 0) return;

  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

  tickets.push(
    {
      id: "1",
      title: "Update footer copyright year",
      description: "Footer still shows 2024",
      priority: "low",
      status: "open",
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
    },
    {
      id: "2",
      title: "Profile picture upload slow",
      description: "Upload takes 30+ seconds",
      priority: "medium",
      status: "open",
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2),
    }
  );
};

seed();

/**
 * Retrieves all tickets
 */
export const getAllTickets = async (): Promise<Ticket[]> => {
  return structuredClone(tickets);
};

/**
 * Retrieves a ticket by ID
 */
export const getTicketById = async (id: string): Promise<Ticket | undefined> => {
  const found = tickets.find((t) => t.id === id);
  return found ? structuredClone(found) : undefined;
};

/**
 * Creates a new ticket
 */
export const createTicket = async (data: CreateTicketData): Promise<Ticket> => {
  const newTicket: Ticket = {
    id: Date.now().toString(),
    title: data.title,
    description: data.description,
    priority: data.priority,
    status: "open",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  tickets.push(newTicket);
  return structuredClone(newTicket);
};

/**
 * Updates an existing ticket
 * Returns undefined if not found (controller will return 404 message "Ticket not found")
 */
export const updateTicket = async (id: string, updates: UpdateTicketData): Promise<Ticket | undefined> => {
  const index = tickets.findIndex((t) => t.id === id);
  if (index === -1) return undefined;

  tickets[index] = {
    ...tickets[index],
    ...updates,
    updatedAt: new Date(),
  };

  return structuredClone(tickets[index]);
};

/**
 * Deletes a ticket
 * Returns false if not found
 */
export const deleteTicket = async (id: string): Promise<boolean> => {
  const index = tickets.findIndex((t) => t.id === id);
  if (index === -1) return false;

  tickets.splice(index, 1);
  return true;
};
