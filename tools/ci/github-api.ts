/**
 * Minimal GitHub REST helpers for PR-scoped CI scripts.
 */

export interface PRFileChange {
  new_path: string;
  old_path: string;
  new_file: boolean;
  deleted_file: boolean;
  renamed_file: boolean;
}

interface GitHubPRFile {
  filename: string;
  previous_filename?: string;
  status: string;
}

interface GitHubIssueComment {
  id: number;
  body: string;
}

function requireEnv(name: string): string {
  const value = Bun.env[name];
  if (value === undefined || value.length === 0) {
    throw new Error(`Environment variable ${name} is not set.`);
  }
  return value;
}

function repoParts(): { owner: string; repo: string } {
  const repository = requireEnv('GITHUB_REPOSITORY');
  const [owner, repo] = repository.split('/');
  if (owner === undefined || repo === undefined) {
    throw new Error(`Invalid GITHUB_REPOSITORY: ${repository}`);
  }
  return { owner, repo };
}

export async function githubFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = requireEnv('GITHUB_TOKEN');
  const { owner, repo } = repoParts();
  const url = `https://api.github.com/repos/${owner}/${repo}${path}`;

  const headers = new Headers(init?.headers);
  headers.set('Accept', 'application/vnd.github+json');
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('X-GitHub-Api-Version', '2022-11-28');

  const response = await fetch(url, {
    ...init,
    headers,
  });
  return response;
}

export function prNumber(): string {
  return requireEnv('PR_NUMBER');
}

export function prUrl(): string {
  const { owner, repo } = repoParts();
  return `https://github.com/${owner}/${repo}/pull/${prNumber()}`;
}

export async function getPRFileChanges(): Promise<PRFileChange[]> {
  const response = await githubFetch(`/pulls/${prNumber()}/files?per_page=100`);
  if (!response.ok) {
    throw new Error(`GitHub PR files API error: ${response.status} ${await response.text()}`);
  }

  const files = (await response.json()) as GitHubPRFile[];

  return files.map((file) => ({
    new_path: file.filename,
    old_path: file.previous_filename ?? file.filename,
    new_file: file.status === 'added',
    deleted_file: file.status === 'removed',
    renamed_file: file.status === 'renamed',
  }));
}

export async function upsertIssueComment(marker: string, body: string): Promise<void> {
  const number = prNumber();
  const listResponse = await githubFetch(`/issues/${number}/comments?per_page=100`);
  if (!listResponse.ok) {
    throw new Error(`GitHub comments list failed: ${listResponse.status} ${await listResponse.text()}`);
  }

  const comments = (await listResponse.json()) as GitHubIssueComment[];
  const existing = comments.find((comment) => comment.body.includes(marker));

  if (existing) {
    const patchResponse = await githubFetch(`/issues/comments/${existing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    });
    if (!patchResponse.ok) {
      throw new Error(`GitHub comment update failed: ${patchResponse.status} ${await patchResponse.text()}`);
    }
    console.log(`✅ Updated PR comment ${existing.id}`);
    return;
  }

  const createResponse = await githubFetch(`/issues/${number}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
  if (!createResponse.ok) {
    throw new Error(`GitHub comment create failed: ${createResponse.status} ${await createResponse.text()}`);
  }
  console.log('✅ Posted PR comment');
}
