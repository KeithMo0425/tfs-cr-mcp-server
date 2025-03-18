import { z } from "zod";
import { MCPTool } from "./BaseTool.js";
import { simpleGit, SimpleGit } from 'simple-git'

interface GenerateGitDiffInput {
  targetBranch: string;
  sourceBranch: string;
  currentProjectFolder: string;
}


export class GenerateGitDiffTool extends MCPTool<GenerateGitDiffInput> {
  name = "generate-git-diff";
  description = "用于生成两个分支的差异git diff。主要用于生成代码审查报告";

  schema = z.object({
    targetBranch: z.string().describe("目标分支"),
    sourceBranch: z.string().describe("源分支"),
    currentProjectFolder: z.string().describe("当前项目文件夹"),
  });
  

  async execute(input: GenerateGitDiffInput) {
    const { targetBranch, sourceBranch, currentProjectFolder } = input;

    const git: SimpleGit = simpleGit({
      baseDir: currentProjectFolder,
      binary: 'git',
      maxConcurrentProcesses: 6,
      trimmed: false,
   });


   try {
    const diff = await git.diff([`origin/${targetBranch.replace('refs/heads/', '')}...origin/${sourceBranch.replace('refs/heads/', '')}`]);
    return this.createSuccessResponse(`
    以下是两个分支的代码差异:

    ### 代码差异
    ${diff}
    ### 

    请帮我审查这些代码变更,重点关注:
    1. 代码质量和可维护性
    2. 潜在的bug和安全问题
    3. 性能优化空间
    4. 是否符合编码规范
    5. 测试覆盖情况


    输出格式（以markdown格式输出）:
    
    - 问题一
      - 文件路径
      - 问题描述
      - 改进建议
      - 代码示例（非必填）
    - 问题二
      - 文件路径
      - 问题描述
      - 改进建议
      - 代码示例（非必填）


    ***谨记：必须要查找文件内容上下文后再给出审查意见和改进建议，不能只看代码差异，需要结合代码差异提供的文件路径，查找到对应文件结合文件内容上下文，给出详细的审查意见和改进建议。***
    
    `);
   } catch (error) {
    return this.createErrorResponse(error as Error);
   }
  }
}