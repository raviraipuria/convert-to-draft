import * as core from '@actions/core'
import * as github from '@actions/github'
import {shouldConvertToDraft} from '../src/util'

const octokit = github.getOctokit(core.getInput('repo-token'))

async function toDraft(id: string): Promise<void> {  
  await octokit.graphql(
    `
    mutation($id: ID!) {
      convertPullRequestToDraft(input: {pullRequestId: $id}) {
        pullRequest {
          id
          number
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
    core.info('fetching all open pull requests')
    const {data: pullRequests} = await octokit.rest.pulls.list({
      ...github.context.repo,
      state: 'open'
    })
    core.info(`open pr count: ${pullRequests.length}`)

    for (const pr of pullRequests) {
      if (!pr.draft && shouldConvertToDraft(pr.updated_at, daysBeforeConvert)) {        
        await toDraft(pr.node_id)
        core.info(`pr converted to draft: ${pr.number} ${pr.title}, last activity time ${pr.updated_at}`)
      }
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
