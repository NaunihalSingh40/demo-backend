import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors()); // Enable CORS for cross-origin requests.

app.get('/time', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send data every second
  const interval = setInterval(() => {
    const time = new Date().toISOString();
    res.write(`data: ${time}\n\n`);
  }, 1000);

  // Cleanup when the connection is closed
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

// Start the server
const PORT = 5004;
app.listen(PORT, () => console.log(`SSE server running on http://localhost:${PORT}`));
