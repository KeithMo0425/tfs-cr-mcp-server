import { z } from "zod";
import { MCPTool } from "./BaseTool.js";
import { TFSApi } from "../utils/TFSApi.js";
import { FastMCP } from "fastmcp";

// interface PushCodeReviewReportInput {
//   reportText: string;
//   prId: string;
// }


// export class PushCodeReviewReport extends MCPTool<PushCodeReviewReportInput> {
//   name = "push-code-review-report";
//   description = "用于将代码审查报告推送到TFS的拉取请求中";

//   schema = z.object({
//     reportText: z.string().describe("代码审查报告"),
//     prId: z.string().describe("拉取请求ID"),
//   });
  

//   async execute(input: PushCodeReviewReportInput) {
//     const { reportText, prId } = input;

//     const tfsApi = new TFSApi();
//     const result = await tfsApi.addPullRequestComment(Number(prId), reportText);

//     return this.createSuccessResponse({ success: !!result });
//   }
// }

export function pushCodeReviewReportTool(server: FastMCP) {
  server.addTool({
    name: "push_code_review_report",
    description: "用于将代码审查报告（包括示例代码）推送到TFS的拉取请求中",
    parameters: z.object({
      reportText: z.string().describe("代码审查报告"),
      prId: z.string().describe("拉取请求ID"),
    }),
    execute: async (args: any) => {
      const { reportText, prId } = args;
      const tfsApi = new TFSApi();
      const result = await tfsApi.addPullRequestComment(Number(prId), reportText);

      return {
        content: [{
          type: "text",
          text: JSON.stringify({ success: !!result }),
        }],
      }
    }
  });
}
  