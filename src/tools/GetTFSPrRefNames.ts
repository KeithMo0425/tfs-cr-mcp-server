import { z } from "zod";
import { MCPTool } from "./BaseTool.js";
import { TFSApi } from "../utils/TFSApi.js";

interface CodeReviewInput {
  id: number;
}

class GetTFSPrRefNamesTool extends MCPTool<CodeReviewInput> {
  name = "get-tfs-pr-ref-names";
  description = `
    用于获取TFS的拉取请求源分支名称和目标分支名称。
    用返回的源分支名称 和 目标分支名称 来生成代码审查报告。
  `;

  schema = z.object({
    id: z.number().describe('拉取请求ID'),
  });

  async execute(input: CodeReviewInput) {
    const tfsApi = new TFSApi();
    const refNames = await tfsApi.getRefNamesOfPullRequest(Number(input.id));
    return this.createSuccessResponse(refNames);
  }
}

export default GetTFSPrRefNamesTool;