import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import GetTFSPrRefNamesTool from "./GetTFSPrRefNames.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { GenerateGitDiffTool } from "./GenerateGitDiff.js";
import { PushCodeReviewReport } from "./PushCodeReviewReport.js";


export function getTools(server: Server) {

  const tools = [
    new GetTFSPrRefNamesTool(),
    new GenerateGitDiffTool(),
    new PushCodeReviewReport(),
  ]
  
  // Tool handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: tools.map((tool) => tool.toolDefinition),
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const { name, arguments: args } = request.params;

      // console.log(`Call tool: ${request}`);

      const tool = tools.find((tool) => tool.toolDefinition.name === name);
      if (!tool) {
        throw new Error(`Unknown tool: ${name}`);
      }

      return tool.toolCall({ params: { name, arguments: args } });

    } catch (error) {
      console.log(`Call tool: `);

      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${errorMessage}` }],
        isError: true,
      };
    }
  });
}
