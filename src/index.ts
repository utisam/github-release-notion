import * as core from "@actions/core";
import { parseConfig } from "./config";
import main from "./main";

const config = (() => {
  try {
    return parseConfig({
      githubToken: core.getInput("github_token") || process.env.GITHUB_TOKEN,
      notionIntegrationSecret: core.getInput("notion_integration_secret"),
      parentDatabaseId: core.getInput("parent_database_id"),
      propertiesYaml: core.getInput("properties"),
      refName: core.getInput("github_ref_name") || process.env.GITHUB_REF_NAME,
      repository:
        core.getInput("github_repository") || process.env.GITHUB_REPOSITORY,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : e;
    core.error(`Invalid input: ${message}`);
    process.exit(-1);
  }
})();

try {
  const result = await main(config);
  core.info(`id: ${result.id}`);
  core.info(`url: ${result.url}`);
  core.setOutput("id", result.id ?? "");
  core.setOutput("url", result.url ?? "");
} catch (e) {
  const message = e instanceof Error ? e.message : e;
  core.error(`❌ Failed to transfer: ${message}`);
  process.exit(1);
}
