# Notion Release Note

Publish release notes to Notion.

## Usage

```yaml
name: Release

on:
  release:
    types: [published]

jobs:
  release:
    steps:
      - name: Publish Release Note
        uses: utisam/github-release-notion@v1
        with:
          notion_integration_secret: ${{ secrets.NOTION_INTEGRATION_SECRET }}
          parent_database_id: ${{ vars.NOTION_DATABASE_ID }}
          properties: |
            Name:
              title:
                - text:
                    content: "${{ github.ref_name }}"
```

Property name of title depends on Language and Region settings.
Use `名前` if you created the database in Japanese.

### Inputs

- `notion_integration_secret`: Secret token of Notion
- `parent_database_id`: The parent database where the new page is inserted
- `properties`: [Database properties](https://developers.notion.com/reference/property-object)
- `github_ref_name (default: github.ref_name)`: Tag to find release in GitHub

### Outputs

- `id`: ID of page
- `url`: URL of page
