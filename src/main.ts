import * as github from "@actions/github";
import type { Config } from "./config";
import type { GitHub } from "@actions/github/lib/utils";
import { RequestError } from "@octokit/request-error";
import { Client as NotionClient } from "@notionhq/client";
import { markdownToBlocks } from "@utisam/marton";

type Octokit = InstanceType<typeof GitHub>;

async function getRelease(octokit: Octokit, config: Config) {
  try {
    return await octokit.rest.repos.getReleaseByTag({
      owner: config.owner,
      repo: config.repositoryName,
      tag: config.refName,
    });
  } catch (e) {
    if (e instanceof RequestError && e.status === 404) {
      return;
    }
    throw e;
  }
}

export interface Output {
  url?: string;
}

async function main(config: Config): Promise<Output> {
  const octokit = github.getOctokit(config.githubToken);
  const notionClient = new NotionClient({
    auth: config.notionIntegrationSecret,
  });

  const release = await getRelease(octokit, config);

  const result = await notionClient.pages.create({
    parent: { database_id: config.parentDatabaseId },
    properties: config.properties,
    children: markdownToBlocks(release?.data.body?.trim() ?? ""),
  });

  if (!("url" in result)) {
    return {};
  }
  return { url: result.url };
}

export default main;
