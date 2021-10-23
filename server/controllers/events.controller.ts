import { Request, Response } from "express";
import { EventType } from "../interfaces/events/events.interface";

const connectedClients = new Map();

const events = (req: Request, res: Response): void => {
  if (connectedClients.has(req.session.id)) {
    connectedClients.get(req.session.id).end();
  }
  connectedClients.set(req.session.id, res);

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  res.write(`:${new Array(2049).join(" ")}\n`);
  res.write("retry: 2000\n");
  res.flush();
};

const sendSSEMessage = (data: any, event: EventType, sender: string): void => {
  connectedClients.forEach((res, sessionId) => {
    if (sessionId === sender) return;
    res.write(`id: ${Date.now()}\n`);
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    res.flush();
  });
};

export { events, sendSSEMessage };
