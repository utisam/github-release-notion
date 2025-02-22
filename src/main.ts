import * as github from "@actions/github";
import type { GitHub } from "@actions/github/lib/utils";
import { Client as NotionClient } from "@notionhq/client";
import { RequestError } from "@octokit/request-error";
import { markdownToBlocks } from "@utisam/marton";
import type { Config } from "./config";

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
  id?: string;
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
  return {
    id: result.id,
    url: result.url,
  };
}

export default main;
