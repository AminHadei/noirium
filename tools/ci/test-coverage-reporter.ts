interface CoverageSummary {
  total: {
    lines: {
      total: number;
      covered: number;
      pct: number;
    };
    statements: {
      total: number;
      covered: number;
      pct: number;
    };
    functions: {
      total: number;
      covered: number;
      pct: number;
    };
    branches: {
      total: number;
      covered: number;
      pct: number;
    };
  };
  [filePath: string]: {
    lines: {
      total: number;
      covered: number;
      pct: number;
    };
    statements: {
      total: number;
      covered: number;
      pct: number;
    };
    functions: {
      total: number;
      covered: number;
      pct: number;
    };
    branches: {
      total: number;
      covered: number;
      pct: number;
    };
  };
}

import {
  getPRFileChanges,
  prUrl,
  upsertIssueComment,
  type PRFileChange,
} from './github-api.ts';

interface FileCoverageReport {
  path: string;
  coverage: number;
  isNew: boolean;
  lines: number;
  coveredLines: number;
  statements: number;
  coveredStatements: number;
  functions: number;
  coveredFunctions: number;
  branches: number;
  coveredBranches: number;
}

const COVERAGE_BOT_MARKER = '<!-- coverage-bot-thread -->';

async function getCoverageSummary(): Promise<CoverageSummary> {
  try {
    const file = Bun.file('coverage/coverage-summary.json');
    return await file.json();
  } catch {
    throw new Error('Coverage summary not found. Make sure tests ran with --coverage');
  }
}

function analyzeCoverageForChangedFiles(
  coverage: CoverageSummary,
  changedFiles: PRFileChange[],
): FileCoverageReport[] {
  const result: FileCoverageReport[] = [];

  for (const change of changedFiles) {
    if (change.deleted_file) continue;

    const filePath = change.new_path;

    // Skip test files
    if (filePath.includes('.test.') || filePath.includes('.spec.')) continue;

    // Skip non-source files (tools, config, playground, etc.)
    if (!filePath.startsWith('src/') || filePath.startsWith('playground/')) continue;

    // Only process testable files
    if (!/\.(js|ts|vue|jsx|tsx)$/.test(filePath)) continue;

    // Find coverage data for this file
    const coverageKey = Object.keys(coverage).find((key) => {
      if (key === 'total') return false;
      // Match by exact path or filename
      return key.endsWith(filePath) || key.includes(filePath);
    });

    if (coverageKey) {
      const fileCoverage = coverage[coverageKey];
      if (!fileCoverage) continue;
      result.push({
        path: filePath,
        coverage: fileCoverage.lines.pct,
        isNew: change.new_file,
        lines: fileCoverage.lines.total,
        coveredLines: fileCoverage.lines.covered,
        statements: fileCoverage.statements.total,
        coveredStatements: fileCoverage.statements.covered,
        functions: fileCoverage.functions.total,
        coveredFunctions: fileCoverage.functions.covered,
        branches: fileCoverage.branches.total,
        coveredBranches: fileCoverage.branches.covered,
      });
    } else {
      // File changed but no coverage data - likely untested
      result.push({
        path: filePath,
        coverage: 0,
        isNew: change.new_file,
        lines: 0,
        coveredLines: 0,
        statements: 0,
        coveredStatements: 0,
        functions: 0,
        coveredFunctions: 0,
        branches: 0,
        coveredBranches: 0,
      });
    }
  }

  // Sort by coverage (lowest first to highlight issues)
  return result.toSorted((a, b) => a.coverage - b.coverage);
}

function buildCoverageReport(
  overallCoverage: CoverageSummary['total'],
  changedFilesCoverage: FileCoverageReport[],
  mrUrl: string,
): string {
  const timestamp = new Date().toISOString();

  let report = '## 🤖 Automated Test Coverage Report\n\n';
  report += `> **Posted by Coverage Bot** • ${new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
  })}\n\n`;
  report += `**Overall Project Coverage**: ${overallCoverage.lines.pct.toFixed(1)}%\n\n`;

  if (changedFilesCoverage.length === 0) {
    report += '✅ No testable files were changed in this PR.\n';
    return report;
  }

  report += `### Changed Files Coverage (${changedFilesCoverage.length} files)\n\n`;

  // Calculate average coverage for changed files
  const avgCoverage =
    changedFilesCoverage.reduce((sum, f) => sum + f.coverage, 0) / changedFilesCoverage.length;
  report += `**Average Coverage for Changed Files**: ${avgCoverage.toFixed(1)}%\n\n`;

  // Critical files (< 80%)
  const criticalFiles = changedFilesCoverage.filter((f) => f.coverage < 80);
  const goodFiles = changedFilesCoverage.filter((f) => f.coverage >= 80);
  const untestedFiles = changedFilesCoverage.filter((f) => f.coverage === 0);

  if (untestedFiles.length > 0) {
    report += '### 🚨 Untested Files (0% coverage)\n\n';
    for (const file of untestedFiles) {
      const badge = file.isNew ? '🆕 NEW' : '📝';
      report += `- ${badge} \`${file.path}\`\n`;
    }
    report += '\n';
  }

  if (criticalFiles.length > 0) {
    report += '### ⚠️ Files Needing Attention (< 80% coverage)\n\n';
    report += '| File | Coverage | Lines | Statements | Functions | Branches |\n';
    report += '|------|----------|-------|------------|-----------|----------|\n';

    for (const file of criticalFiles) {
      const badge = file.isNew ? '🆕' : '📝';
      const coverageFormatted = `**${file.coverage.toFixed(1)}%**`;
      const linesFormatted = `${file.coveredLines}/${file.lines}`;
      const stmtsFormatted = `${file.coveredStatements}/${file.statements}`;
      const funcsFormatted =
        file.functions > 0 ? `${file.coveredFunctions}/${file.functions}` : '-';
      const branchesFormatted =
        file.branches > 0 ? `${file.coveredBranches}/${file.branches}` : '-';

      report += `| ${badge} \`${file.path}\` | ${coverageFormatted} | ${linesFormatted} | ${stmtsFormatted} | ${funcsFormatted} | ${branchesFormatted} |\n`;
    }
    report += '\n';
  }

  if (goodFiles.length > 0) {
    report += '### ✅ Well Covered Files (≥ 80%)\n\n';
    for (const file of goodFiles.slice(0, 10)) {
      const badge = file.isNew ? '🆕' : '📝';
      report += `- ${badge} \`${file.path}\` - ${file.coverage.toFixed(1)}% (${file.coveredLines}/${file.lines} lines)\n`;
    }

    if (goodFiles.length > 10) {
      report += `\n_... and ${goodFiles.length - 10} more well-covered files_\n`;
    }
    report += '\n';
  }

  // Recommendations
  if (untestedFiles.length > 0 || criticalFiles.length > 0) {
    report += '### 💡 Recommendations\n\n';

    if (untestedFiles.length > 0) {
      report += `- ❌ **${untestedFiles.length} file(s) have no test coverage** - Add unit tests before merging\n`;
    }

    if (criticalFiles.length > 0) {
      report += `- ⚠️ **${criticalFiles.length} file(s) below 80% coverage** - Consider adding more test cases\n`;
    }

    report += `- 📖 Review [Testing conventions](${mrUrl.replace(/\/pull\/\d+$/, '')}/blob/main/docs/content/testing.md) for best practices\n`;
    report += '\n';
  }

  report += '---\n';
  report += `[View pull request](${mrUrl})\n`;
  report += `<!-- test-coverage-report:${timestamp} -->`;

  return report;
}

async function main(): Promise<void> {
  try {
    console.log('Reading test coverage summary...');
    const coverage = await getCoverageSummary();

    console.log('Fetching changed files from PR...');
    const prChanges = await getPRFileChanges();

    console.log('Analyzing coverage for changed files...');
    const changedFilesCoverage = analyzeCoverageForChangedFiles(coverage, prChanges);

    const pullRequestUrl = prUrl();

    console.log('Building coverage report...');
    const prReport = buildCoverageReport(coverage.total, changedFilesCoverage, pullRequestUrl);
    const reportBody = `${COVERAGE_BOT_MARKER}\n\n${prReport}`;

    console.log('Posting coverage report to GitHub PR...');
    await upsertIssueComment(COVERAGE_BOT_MARKER, reportBody);

    // Summary
    const untestedCount = changedFilesCoverage.filter((f) => f.coverage === 0).length;
    const criticalCount = changedFilesCoverage.filter(
      (f) => f.coverage > 0 && f.coverage < 80,
    ).length;

    console.log('\n📊 Coverage Summary:');
    console.log(`   Total files changed: ${changedFilesCoverage.length}`);
    console.log(`   Untested files: ${untestedCount}`);
    console.log(`   Files < 80%: ${criticalCount}`);
    console.log(`   Overall coverage: ${coverage.total.lines.pct.toFixed(1)}%`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

void main();
