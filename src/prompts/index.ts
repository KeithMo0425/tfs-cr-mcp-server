import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { GetPromptRequestSchema, ListPromptsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { CodeReviewPrompt } from "./CodeReview.js";

export function getPrompt(server: Server) {
  const PROMPTS = [
    new CodeReviewPrompt()
  ];

  // List available prompts
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: PROMPTS.map(prompt => prompt.promptDefinition)
    };
  });

  // Get specific prompt
  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const prompt = PROMPTS.find(prompt => prompt.name === request.params.name);
    if (!prompt) {
      throw new Error(`Prompt not found: ${request.params.name}`);
    }

    return {
      messages: await prompt.getMessages()
    }
  });
}