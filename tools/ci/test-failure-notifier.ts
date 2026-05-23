import { prUrl, upsertIssueComment } from './github-api.ts';

interface JUnitTestCase {
  name: string;
  classname: string;
  time: number;
  failure?: {
    message: string;
    type: string;
    content: string;
  };
}

const GITHUB_RUN_URL =
  Bun.env['GITHUB_SERVER_URL'] && Bun.env['GITHUB_REPOSITORY'] && Bun.env['GITHUB_RUN_ID']
    ? `${Bun.env['GITHUB_SERVER_URL']}/${Bun.env['GITHUB_REPOSITORY']}/actions/runs/${Bun.env['GITHUB_RUN_ID']}`
    : undefined;

const TEST_FAILURE_BOT_MARKER = '<!-- test-failure-bot -->';

async function parseJUnitXML(): Promise<{
  total: number;
  failed: number;
  failures: JUnitTestCase[];
}> {
  try {
    const xmlFile = Bun.file('coverage/junit.xml');
    const xmlContent = await xmlFile.text();

    const testcases = xmlContent.match(/<testcase[^>]*>[\s\S]*?<\/testcase>/g) ?? [];
    const failures: JUnitTestCase[] = [];
    let total = 0;
    let failed = 0;

    for (const testcase of testcases) {
      total++;
      const nameMatch = testcase.match(/name="([^"]*)"/);
      const classnameMatch = testcase.match(/classname="([^"]*)"/);
      const timeMatch = testcase.match(/time="([^"]*)"/);

      const name = nameMatch?.[1] ?? 'Unknown';
      const classname = classnameMatch?.[1] ?? 'Unknown';
      const time = timeMatch ? Number.parseFloat(timeMatch?.[1] ?? '0') : 0;

      if (testcase.includes('<failure')) {
        failed++;
        const failureMatch = testcase.match(
          /<failure[^>]*message="([^"]*)"[^>]*>([\s\S]*?)<\/failure>/,
        );
        const message = failureMatch?.[1] ?? 'Unknown failure';
        const content = failureMatch?.[2] ?? '';

        failures.push({
          name,
          classname,
          time,
          failure: {
            message,
            type: 'AssertionError',
            content,
          },
        });
      }
    }

    return {
      total,
      failed,
      failures,
    };
  } catch (error) {
    throw new Error(`Failed to parse JUnit XML: ${String(error)}`, { cause: error });
  }
}

function buildFailureReport(total: number, failed: number, failures: JUnitTestCase[]): string {
  const emoji = failed > 0 ? '❌' : '✅';
  const status = failed > 0 ? 'FAILED' : 'PASSED';

  let report = `### ${emoji} Test Results: ${status}\n\n`;
  report += `**Total Tests**: ${total}\n`;
  report += `**Passed**: ${total - failed}\n`;
  report += `**Failed**: ${failed}\n\n`;

  if (failed > 0) {
    report += `### ❌ Failed Tests (${failed})\n\n`;

    for (const failure of failures.slice(0, 10)) {
      report += `#### ${failure.classname}\n`;
      report += `**Test**: ${failure.name}\n`;
      report += `**Duration**: ${failure.time.toFixed(2)}s\n`;
      if (failure.failure) {
        report += `**Error**: ${failure.failure.message}\n`;
        report += `\n<details>\n<summary>Show full error</summary>\n\n`;
        report += `\`\`\`\n${failure.failure.content.trim().slice(0, 500)}\n\`\`\`\n`;
        report += `</details>\n\n`;
      }
      report += '---\n\n';
    }

    if (failures.length > 10) {
      report += `_... and ${failures.length - 10} more failures_\n\n`;
    }

    if (GITHUB_RUN_URL) {
      report += `[View workflow run](${GITHUB_RUN_URL})\n`;
    }
    report += `[View pull request](${prUrl()})\n`;
  } else {
    report += '✅ All tests passed successfully!\n';
  }

  return report;
}

async function main(): Promise<void> {
  try {
    const junitFile = Bun.file('coverage/junit.xml');
    if (!(await junitFile.exists())) {
      console.log('No test artifacts found — tests did not run. Skipping notification.');
      process.exit(0);
    }

    console.log('Parsing test results...');
    const { total, failed, failures } = await parseJUnitXML();

    console.log(`\n📊 Test Summary:`);
    console.log(`   Total: ${total}`);
    console.log(`   Passed: ${total - failed}`);
    console.log(`   Failed: ${failed}\n`);

    if (failed > 0) {
      console.log('⚠️ Tests failed! Posting PR comment...\n');

      const report = buildFailureReport(total, failed, failures);
      await upsertIssueComment(
        TEST_FAILURE_BOT_MARKER,
        `${TEST_FAILURE_BOT_MARKER}\n\n${report}`,
      );

      console.log('\n❌ Tests failed — notification sent');
      process.exit(1);
    }

    console.log('✅ All tests passed — no notifications needed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

void main();
