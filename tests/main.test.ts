import { expect, test } from 'vitest'
import { readGithubUsageReportFile, readGithubUsageReportFileSync } from '../src/index';
import { UsageReportLine } from '../src/types';
import { readGithubUsageReport } from '../src/usage-report';

const mockUsageReport = `"formatted_date","product","sku","quantity","unit_type","applied_cost_per_quantity","gross_amount","discount_amount","net_amount","username","organization","repository_name","workflow_name","workflow_path","cost_center_name"
"2025-05-01","actions","actions_linux","2","minutes","0.008","0.016","0.016","0","","octodemo-framework","bookstore-vigilant-acorn","Dependency Review",".github/workflows/dependency-review.yml","test_cc_docusign"
"2025-05-01","actions","actions_linux","1","minutes","0.008","0.008","0.008","0","luispujols","LP-Octodemo","lp-awesome-actions","Close stale issues",".github/workflows/stale.yml",""`;

const mockUsageReportFile = './tests/data/usageReport_1_0b650fc20d564ed2bddf337ac27c7a57.csv';

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
  expect(receivedLines[0]).toEqual(expectedLines[0]);
  expect(usageReport.lines[0]).toEqual(expectedLines[0]);
  expect(usageReport.lines.length).toEqual(50558);
}, 600000);

test('readGithubUsageReportFileSync works', async () => {
  const usageReport = await readGithubUsageReportFileSync(mockUsageReportFile);
  expect(usageReport.lines[0]).toEqual(expectedLines[0]);
  expect(usageReport.lines.length).toEqual(50558);
}, 600000);
