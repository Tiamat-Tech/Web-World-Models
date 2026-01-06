import { createApp } from "./app.js";
import { env } from "./utils/env.js";

const app = createApp();

const server = app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${env.port}`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});
