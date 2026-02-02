import type { Ticket, CreateTicketData, UpdateTicketData, TicketPriority } from "../models/ticketModels";


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

const PRIORITY_BASE: Record<TicketPriority, number> = {
  critical: 50,
  high: 30,
  medium: 20,
  low: 10,
};

// TODO: update these after watching your demo video carefully
const AGE_MULTIPLIER_PER_DAY = 1; // you will change this
const THRESHOLDS = {
  LOW_MAX: 39,
  MEDIUM_MAX: 69,
  HIGH_MAX: 99,
};

const daysOld = (createdAt: Date): number => {
  const diffMs = Date.now() - createdAt.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface UrgencyResult {
  score: number;
  level: UrgencyLevel;
  message: string;
}

/**
 * Calculates urgency score and level for a ticket
 */
export const calculateUrgency = async (ticket: Ticket): Promise<UrgencyResult> => {
  // Demo might treat resolved tickets differently — update if needed after video
  if (ticket.status === "resolved") {
    const base = PRIORITY_BASE[ticket.priority];
    return { score: base, level: "LOW", message: "LOW" };
  }

  const base = PRIORITY_BASE[ticket.priority];
  const age = daysOld(ticket.createdAt);
  const score = base + age * AGE_MULTIPLIER_PER_DAY;

  if (score <= THRESHOLDS.LOW_MAX) return { score, level: "LOW", message: "LOW" };
  if (score <= THRESHOLDS.MEDIUM_MAX) return { score, level: "MEDIUM", message: "MEDIUM" };
  if (score <= THRESHOLDS.HIGH_MAX) return { score, level: "HIGH", message: "HIGH" };
  return { score, level: "CRITICAL", message: "CRITICAL" };
};

