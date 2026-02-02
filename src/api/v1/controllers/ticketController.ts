import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as ticketService from "../services/ticketService";
import type { TicketPriority, TicketStatus } from "../models/ticketModels";
import type { TicketPriority, TicketStatus } from "../models/ticketModels";


const VALID_PRIORITIES: TicketPriority[] = ["critical", "high", "medium", "low"];
const VALID_STATUSES: TicketStatus[] = ["open", "in-progress", "resolved"];

export const getAllTickets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tickets = await ticketService.getAllTickets();
    res.status(HTTP_STATUS.OK).json({
      message: "Tickets retrieved successfully",
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const createTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, priority } = req.body;

    // REQUIRED assignment messages:
    if (!title) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Missing required field: title" });
      return;
    }
    if (!description) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Missing required field: description" });
      return;
    }
    if (!priority || !VALID_PRIORITIES.includes(priority)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid priority. Must be one of: critical, high, medium, low",
      });
      return;
    }

    const newTicket = await ticketService.createTicket({ title, description, priority });
    res.status(HTTP_STATUS.CREATED).json({
      message: "Ticket created successfully",
      data: newTicket,
    });
  } catch (error) {
    next(error);
  }
};
export const getTicketById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const ticket = await ticketService.getTicketById(id);
    if (!ticket) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Ticket not found" });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: "Ticket retrieved successfully",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};
