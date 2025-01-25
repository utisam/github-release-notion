import { parseConfig } from "./config";

describe("parseConfig", () => {
  it("should throw an error if githubToken is missing", () => {
    expect(() =>
      parseConfig({
        notionIntegrationSecret: "secret",
        parentDatabaseId: "databaseId",
        propertiesYaml: "properties: {}",
        refName: "1.0.0",
        repository: "owner/repo",
      }),
    ).toThrow("No github_token");
  });

  it("should throw an error if notionIntegrationSecret is missing", () => {
    expect(() =>
      parseConfig({
        githubToken: "token",
        parentDatabaseId: "databaseId",
        propertiesYaml: "properties: {}",
        refName: "1.0.0",
        repository: "owner/repo",
        notionIntegrationSecret: "",
      }),
    ).toThrow("No notion_integration_secret");
  });

  it("should throw an error if parentDatabaseId is missing", () => {
    expect(() =>
      parseConfig({
        githubToken: "token",
        notionIntegrationSecret: "secret",
        propertiesYaml: "properties: {}",
        refName: "1.0.0",
        repository: "owner/repo",
        parentDatabaseId: "",
      }),
    ).toThrow("No parent_database_id");
  });

  it("should throw an error if refName is1.0.0", () => {
    expect(() =>
      parseConfig({
        githubToken: "token",
        notionIntegrationSecret: "secret",
        parentDatabaseId: "databaseId",
        propertiesYaml: "properties: {}",
        repository: "owner/repo",
      }),
    ).toThrow("No github_ref_name");
  });

  it("should throw an error if repository is missing", () => {
    expect(() =>
      parseConfig({
        githubToken: "token",
        notionIntegrationSecret: "secret",
        parentDatabaseId: "databaseId",
        propertiesYaml: "properties: {}",
        refName: "1.0.0",
      }),
    ).toThrow("No github_repository");
  });

  it("should throw an error if repository does not contain owner", () => {
    expect(() =>
      parseConfig({
        githubToken: "token",
        notionIntegrationSecret: "secret",
        parentDatabaseId: "databaseId",
        propertiesYaml: "properties: {}",
        refName: "1.0.0",
        repository: "/repo",
      }),
    ).toThrow("No repository owner");
  });

  it("should throw an error if repository does not contain repository name", () => {
    expect(() =>
      parseConfig({
        githubToken: "token",
        notionIntegrationSecret: "secret",
        parentDatabaseId: "databaseId",
        propertiesYaml: "properties: {}",
        refName: "1.0.0",
        repository: "owner/",
      }),
    ).toThrow("No repository name");
  });

  it("should return a valid config object if all required fields are provided", () => {
    const config = parseConfig({
      githubToken: "token",
      notionIntegrationSecret: "secret",
      parentDatabaseId: "databaseId",
      propertiesYaml: `Name:
              title:
                - text:
                    content: "Name"`,
      refName: "1.0.0",
      repository: "owner/repo",
    });

    expect(config).toEqual({
      githubToken: "token",
      notionIntegrationSecret: "secret",
      owner: "owner",
      parentDatabaseId: "databaseId",
      properties: {
        Name: {
          title: [
            {
              text: {
                content: "Name",
              },
            },
          ],
        },
      },
      refName: "1.0.0",
      repositoryName: "repo",
    });
  });
});
