import { parse } from "yaml";
import type { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";

type NotionProperties = CreatePageParameters["properties"];

export interface Config {
  githubToken: string;
  notionIntegrationSecret: string;
  owner: string;
  parentDatabaseId: string;
  properties: NotionProperties;
  refName: string;
  repositoryName: string;
}

export function parseConfig(config: {
  githubToken?: string;
  notionIntegrationSecret: string;
  parentDatabaseId: string;
  propertiesYaml: string;
  refName?: string;
  repository?: string;
}): Config {
  if (!config.githubToken) {
    throw Error("No github_token");
  }
  if (!config.notionIntegrationSecret) {
    throw Error("No notion_integration_secret");
  }
  if (!config.parentDatabaseId) {
    throw Error("No parent_database_id");
  }
  const properties = validateProperties(parse(config.propertiesYaml));
  if (!config.refName) {
    throw Error("No github_ref_name");
  }
  if (!config.repository) {
    throw Error("No github_repository");
  }
  const [owner, repositoryName] = config.repository.split("/");
  if (!owner) {
    throw Error("No repository owner");
  }
  if (!repositoryName) {
    throw Error("No repository name");
  }
  return {
    githubToken: config.githubToken,
    notionIntegrationSecret: config.notionIntegrationSecret,
    owner,
    parentDatabaseId: config.parentDatabaseId,
    properties: properties,
    refName: config.refName,
    repositoryName,
  };
}

function validateProperties(properties: unknown): NotionProperties {
  if (properties === null || typeof properties !== "object") {
    throw Error("properties must be an object");
  }
  const records = properties as Record<string, unknown>;
  // TODO: validate in more detail
  return records as NotionProperties;
}
