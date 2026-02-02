// import the express application and type definition
import express, { Express, Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "./constants/httpConstants";
// import morgan for logging
import morgan from "morgan";

const app: Express = express();

// Interface for health check response - defines the structure of our response object
interface HealthCheckResponse {
  status: string;
  uptime: number;
  timestamp: string;
  version: string;
}

// Middleware for logging HTTP requests
app.use(morgan("combined"));

// Middleware for parsing JSON.
app.use(express.json());

// Basic routes
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Health endpoint
app.get("/api/v1/health", (req: Request, res: Response) => {
  const healthData: HealthCheckResponse = {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  };

  res.status(HTTP_STATUS.OK).json(healthData);
});

/**
 * Health check endpoint that returns server status information
 * @returns JSON response with server health metrics
 */
app.get("/api/v1/health", (req, res) => {
  const healthData: HealthCheckResponse = {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  };

  res.json(healthData);
});

// Basic error handling 
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
});

export default app;