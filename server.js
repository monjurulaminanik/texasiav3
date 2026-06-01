// server.js for cPanel Passenger hosting
// This file acts as the entry point for Phusion Passenger in cPanel.
const path = require('path');
const next = require('next');

// Since Passenger manages the HTTP server and ports for us, we can simply
// delegate directly to the Next.js standard standalone output if available.
// However, the standard Next.js approach with custom servers relies on http.createServer
const { createServer } = require('http');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Initialize the Next.js app instance
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
