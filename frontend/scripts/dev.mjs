import net from "node:net";
import { spawn } from "node:child_process";

const START_PORT = 3001;

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => {
      resolve(false);
    });

    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port, "127.0.0.1");
  });
}

async function findPort(startPort) {
  let port = startPort;

  while (!(await isPortFree(port))) {
    port++;
  }

  return port;
}

const port = await findPort(START_PORT);

if (port !== START_PORT) {
  console.log(`Port ${START_PORT} is in use, using ${port} instead.`);
}

const child = spawn("next", ["dev", "-p", String(port)], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});