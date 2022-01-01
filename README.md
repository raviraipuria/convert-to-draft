# Convert to Draft PRs
Convert open pull requests to draft if they had no activity for a specified amount of time.

### Input Options

#### `repo-token`
**Required** Follow https://docs.github.com/en/graphql/guides/forming-calls-with-graphql#authenticating-with-graphql to generate access token. At a minimum it should have pullrequest read/write access.

#### `days-before-convert-draft`
**Required** The idle number of days to wait before converting pull requests to draft.

### Example
```yaml
name: convert-to-draft

on:
  schedule:
    - cron: '0 0 * * *'

jobs:
  convert-to-draft:
    runs-on: ubuntu-latest
    steps:
      - uses: raviraipuria/convert-to-draft@v1.0.0
        with:
          repo-token: ${{ secrets.TOKEN }}
          days-before-convert-draft: 1
```

