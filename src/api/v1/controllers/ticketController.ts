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