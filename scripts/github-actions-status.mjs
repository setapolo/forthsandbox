const workflow = process.env.GITHUB_WORKFLOW_FILE || 'pages-e2e.yml';
const repository = process.env.ACTIONS_STATUS_REPOSITORY || process.env.GITHUB_REPOSITORY || 'setapolo/forthsandbox';
const branch = process.env.GITHUB_REF_NAME || process.env.GITHUB_BRANCH || '';
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

function apiUrl(path, params = {}) {
  const url = new URL(`https://api.github.com${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }
  return url;
}

async function githubFetch(url) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'forthsandbox-actions-status',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(url, { headers });
  } catch (error) {
    throw new Error(
      `Unable to reach GitHub Actions API at ${url}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} ${response.statusText}: ${text.slice(0, 500)}`);
  }

  return text ? JSON.parse(text) : null;
}

function summarizeRun(run) {
  return [
    `run=${run.id}`,
    `status=${run.status}`,
    `conclusion=${run.conclusion ?? 'pending'}`,
    `branch=${run.head_branch}`,
    `event=${run.event}`,
    `created=${run.created_at}`,
    `updated=${run.updated_at}`,
    `url=${run.html_url}`,
  ].join(' ');
}

const runsUrl = apiUrl(`/repos/${repository}/actions/workflows/${workflow}/runs`, {
  branch,
  per_page: '1',
});

try {
  const runs = await githubFetch(runsUrl);
  const run = runs.workflow_runs?.[0];

  if (!run) {
    console.log(`No GitHub Actions runs found for ${repository}/${workflow}${branch ? ` on ${branch}` : ''}.`);
    process.exit(0);
  }

  console.log(`Latest ${workflow} run: ${summarizeRun(run)}`);

  const jobs = await githubFetch(apiUrl(`/repos/${repository}/actions/runs/${run.id}/jobs`, { per_page: '100' }));
  for (const job of jobs.jobs ?? []) {
    console.log(`job=${job.name} status=${job.status} conclusion=${job.conclusion ?? 'pending'} url=${job.html_url}`);

    for (const step of job.steps ?? []) {
      if (step.conclusion && step.conclusion !== 'success' && step.conclusion !== 'skipped') {
        console.log(
          `  step=${step.name} status=${step.status} conclusion=${step.conclusion} started=${step.started_at} completed=${step.completed_at}`,
        );
      }
    }
  }

  console.log(`Artifacts: https://github.com/${repository}/actions/runs/${run.id}#artifacts`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
