import express, { Router } from "express";
import * as ticketController from "../controllers/ticketController";

const router: Router = express.Router();

// CRUD routes
router.get("/", ticketController.getAllTickets);
router.get("/:id", ticketController.getTicketById);
router.post("/", ticketController.createTicket);
router.put("/:id", ticketController.updateTicket);
router.delete("/:id", ticketController.deleteTicket);

// Special urgency route
router.get("/:id/urgency", ticketController.getTicketUrgency);

export default router;
