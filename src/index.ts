#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getTools } from "./tools/index.js";
import { getPrompt } from "./prompts/index.js";
import { FastMCP } from "fastmcp";

// Server setup
// const server = new Server(
//   {
//     name: "secure-filesystem-server",
//     version: "0.2.0",
//   },
//   {
//     capabilities: {
//       tools: {},
//       prompts: {},
//     },
//   },
// );

const server = new FastMCP(
  {
    name: "secure-filesystem-server",
    version: "0.2.0",
    // capabilities: {
    //   tools: {},
    //   prompts: {},
    // },
  },
);

getTools(server);
// getPrompt(server);

server.start({
  transportType: "stdio",
});

// Start server
// async function runServer() {
//   const transport = new StdioServerTransport();
//   await server.connect(transport);
//   console.error("Secure MCP Filesystem Server running on stdio");
// }

// runServer().catch((error) => {
//   console.error("Fatal error running server:", error);
//   process.exit(1);
// });