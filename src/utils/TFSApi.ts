import * as azdev from "azure-devops-node-api";

export class TFSApi {
  private readonly orgUrl: string = process.env.TFS_URL || "http://youcaihuadev.youcaihua.net:8078/tfs/YCH";

  private readonly token: string = process.env.TFS_TOKEN || "";

  private connection: azdev.WebApi;

  constructor() {
    this.connection = new azdev.WebApi(this.orgUrl, azdev.getPersonalAccessTokenHandler(this.token));
  }

  async getGitApi() {
    return this.connection.getGitApi();
  }

  /**
   * 获取拉取请求的源分支名称和目标分支名称
   * @param id 拉取请求ID
   * @returns 源分支名称和目标分支名称
   */
  async getRefNamesOfPullRequest(id: number) {
    const pullRequest = await (await this.getGitApi()).getPullRequestById(id);
    return {
      sourceRefName: pullRequest.sourceRefName,
      targetRefName: pullRequest.targetRefName,
    };
  }


}