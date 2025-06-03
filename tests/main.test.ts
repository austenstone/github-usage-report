import { expect, test } from 'vitest'
import { readGithubUsageReportFile, readGithubUsageReportFileSync, readModelUsageReportFile, readModelUsageReportFileSync } from '../src/node';
import { UsageReportLine } from '../src/types';
import { readGithubUsageReport, readModelUsageReport } from '../src/usage-report';
import { writeFileSync } from 'fs';

const mockUsageReport = `"formatted_date","product","sku","quantity","unit_type","applied_cost_per_quantity","gross_amount","discount_amount","net_amount","username","organization","repository_name","workflow_name","workflow_path","cost_center_name"
"2025-05-01","actions","actions_linux","2","minutes","0.008","0.016","0.016","0","","octodemo-framework","bookstore-vigilant-acorn","Dependency Review",".github/workflows/dependency-review.yml","test_cc_docusign"
"2025-05-01","actions","actions_linux","1","minutes","0.008","0.008","0.008","0","luispujols","LP-Octodemo","lp-awesome-actions","Close stale issues",".github/workflows/stale.yml",""`;

const mockUsageReportFile = './tests/data/usageReport_1_0b650fc20d564ed2bddf337ac27c7a57.csv';

const mockModelUsageReport = `Timestamp,User,Model,Requests Used,Exceeds Monthly Quota,Total Monthly Quota
2025-06-02T22:34:09Z,bspann,claude-sonnet-4,1.00,false,Unlimited
2025-06-02T22:35:15Z,jdoe,gpt-4,2.50,false,100`;

const expectedLines = [
  {
    date: new Date('2025-05-01'),
    product: 'actions',
    sku: 'actions_linux',
    quantity: 2,
    unitType: 'minutes',
    pricePerUnit: 0.008,
    grossAmount: 0.016,
    discountAmount: 0.016,
    netAmount: 0,
    username: '',
    organization: 'octodemo-framework',
    repositoryName: 'bookstore-vigilant-acorn',
    workflowName: 'Dependency Review',
    workflowPath: '.github/workflows/dependency-review.yml',
    costCenterName: 'test_cc_docusign',
  },
  {
    date: new Date('2025-05-01'),
    product: 'actions',
    sku: 'actions_linux',
    quantity: 1,
    unitType: 'minutes',
    pricePerUnit: 0.008,
    grossAmount: 0.008,
    discountAmount: 0.008,
    netAmount: 0,
    username: 'luispujols',
    organization: 'LP-Octodemo',
    repositoryName: 'lp-awesome-actions',
    workflowName: 'Close stale issues',
    workflowPath: '.github/workflows/stale.yml',
    costCenterName: '',
  }
]

test('readGithubUsageReport works', async () => {
  const usageReport = await readGithubUsageReport(mockUsageReport);
  expect(usageReport.lines[0]).toEqual(expectedLines[0]);
  expect(usageReport.lines[1]).toEqual(expectedLines[1]);
  expect(usageReport.lines.length).toEqual(2);
}, 600000);

test('readGithubUsageReportFile works', async () => {
  const receivedLines: UsageReportLine[] = [];
  const usageReport = await readGithubUsageReportFile(mockUsageReportFile, (line) => {
    if (line) {
      receivedLines.push(line);
    }
  });
  writeFileSync('./tests/data/usageReport.json', JSON.stringify(usageReport, null, 2));
  expect(receivedLines[0]).toEqual(expectedLines[0]);
  expect(usageReport.lines[0]).toEqual(expectedLines[0]);
  expect(usageReport.lines.length).toEqual(50558);
}, 600000);

test('readGithubUsageReportFileSync works', async () => {
  const usageReport = await readGithubUsageReportFileSync(mockUsageReportFile);
  expect(usageReport.lines[0]).toEqual(expectedLines[0]);
  expect(usageReport.lines.length).toEqual(50558);
}, 600000);

test('readModelUsageReport should parse model usage report correctly', async () => {
  const result = await readModelUsageReport(mockModelUsageReport);
  
  expect(result.lines).toHaveLength(2);
  expect(result.lines[0]).toEqual({
    timestamp: new Date('2025-06-02T22:34:09Z'),
    user: 'bspann',
    model: 'claude-sonnet-4',
    requestsUsed: 1.00,
    exceedsMonthlyQuota: false,
    totalMonthlyQuota: 'Unlimited',
  });
  expect(result.lines[1]).toEqual({
    timestamp: new Date('2025-06-02T22:35:15Z'),
    user: 'jdoe',
    model: 'gpt-4',
    requestsUsed: 2.50,
    exceedsMonthlyQuota: false,
    totalMonthlyQuota: '100',
  });
  expect(result.startDate).toEqual(new Date('2025-06-02T22:34:09Z'));
  expect(result.endDate).toEqual(new Date('2025-06-02T22:35:15Z'));
});

test('readModelUsageReportFile should parse model usage file correctly', async () => {
  const mockModelUsageReportFile = './tests/data/premium_interactions_b16336c228824bf39744429a39994e16.csv';
  const report = await readModelUsageReportFile(mockModelUsageReportFile);
  
  expect(report.lines).toHaveLength(4);
  expect(report.lines[0].user).toBe('bspann');
  expect(report.lines[0].model).toBe('claude-sonnet-4');
  expect(report.lines[0].exceedsMonthlyQuota).toBe(false);
  expect(report.lines[0].totalMonthlyQuota).toBe('Unlimited');
});

test('readModelUsageReportFileSync should parse model usage file correctly', async () => {
  const mockModelUsageReportFile = './tests/data/premium_interactions_b16336c228824bf39744429a39994e16.csv';
  const report = await readModelUsageReportFileSync(mockModelUsageReportFile);
  
  expect(report.lines).toHaveLength(4);
  expect(report.lines[1].user).toBe('bspann');
  expect(report.lines[1].requestsUsed).toBe(1.00);
});
