import * as core from '@actions/core'
import * as github from '@actions/github'
import {shouldConvertToDraft} from '../src/util'

const octokit = github.getOctokit(core.getInput('repo-token'))

async function toDraft(id: string): Promise<void> {
  core.info(`converting pr ${id} to draft`)
  await octokit.graphql(
    `
    mutation($id: ID!) {
      convertPullRequestToDraft(input: {pullRequestId: $id}) {
        pullRequest {
          id
          number
          state
          isDraft
        }
      }
    }
    `,
    {
      id
    }
  )
}

async function run(): Promise<void> {
  try {
    const daysBeforeConvert = parseInt(
      core.getInput('days-before-convert-draft', {required: true})
    )
    core.info('fetching pull requests')
    const {data: pullRequests} = await octokit.rest.pulls.list({
      ...github.context.repo,
      state: 'open'
    })
    core.info(`open pr count: ${pullRequests.length}`)

    for (const pr of pullRequests) {
      if (shouldConvertToDraft(pr.updated_at, daysBeforeConvert)) {
        await toDraft(pr.node_id)
        core.info(`pr converted to draft: ${pr.node_id}`)
      }
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
