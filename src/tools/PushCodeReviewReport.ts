import { z } from "zod";
import { MCPTool } from "./BaseTool.js";
import { TFSApi } from "../utils/TFSApi.js";

interface PushCodeReviewReportInput {
  reportText: string;
  prId: string;
}


export class PushCodeReviewReport extends MCPTool<PushCodeReviewReportInput> {
  name = "push-code-review-report";
  description = "用于将代码审查报告推送到TFS的拉取请求中";

  schema = z.object({
    reportText: z.string().describe("代码审查报告"),
    prId: z.string().describe("拉取请求ID"),
  });
  

  async execute(input: PushCodeReviewReportInput) {
    const { reportText, prId } = input;

    const tfsApi = new TFSApi();
    const result = await tfsApi.addPullRequestComment(Number(prId), reportText);

    return this.createSuccessResponse({ success: !!result });
  }
}